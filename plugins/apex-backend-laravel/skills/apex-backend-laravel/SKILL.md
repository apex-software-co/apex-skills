---
name: apex-backend-laravel
description: >-
  Backend code conventions for this Matti/Apex ERP (Laravel 11, PHP 8.2,
  multi-tenant). Use this skill WHENEVER writing or reviewing ANY backend PHP in
  this repo — controllers, services, DTOs/data factories, repositories, Eloquent
  models, FormRequests, enums, migrations, or PHPUnit tests — even when the user
  doesn't name a "pattern". The domain logic lives in per-module service classes
  under app/Erp, not in controllers, and every record is scoped by organization
  (and often company). Follow this before adding a CRUD endpoint, a new domain
  module, money/totals math, or a new test, so the code matches the existing
  architecture instead of generic Laravel.
---

# Apex / Matti ERP — Backend conventions

This is a **multi-tenant** Laravel 11 JSON API for a construction-materials ERP. Two rules dominate every decision:

1. **Business logic lives in services under `app/Erp/<Module>/`, never in controllers.** Controllers are thin: authorize → validate → build a DTO → call a service → return JSON.
2. **Every row belongs to an organization** (and frequently a company). Reads and writes are scoped by `organization_id`. Leaking data across tenants is the worst bug you can ship here.

When in doubt, open the **Sale module** (`app/Erp/Sale/`, `app/Http/Controllers/Erp/Sale/SaleController.php`) — it is the most complete reference and exercises every pattern below.

## Module anatomy

A domain module is a self-contained folder `app/Erp/<Module>/` with these pieces (add only what the operation needs):

```
app/Erp/<Module>/
├── Data/            <Module>Data.php (Spatie DTO) + <Module>DataFactory.php
├── Services/        one class per operation: Store…, Process…, Calc…, Cancel…
├── Repository/      <Module>Repository.php — query/filter/paginate, org-scoped
├── Validators/      domain rules that throw ValidationException (optional)
└── Enums/           status enums backed by string
```

HTTP-layer counterparts live outside `app/Erp`:
- Controller: `app/Http/Controllers/Erp/<Module>/<Module>Controller.php`
- FormRequest: `app/Http/Requests/Erp/<Module>/Store<Module>Request.php`
- Model: `app/Models/<Model>.php` (models are flat, not nested per module)

### Request flow (store/update)

```
Controller
  → StoreXRequest        (auth via Gate + validation rules + pt-BR messages)
  → XDataFactory::create($organization, $request->all())   (raw array → typed DTO, loads related models org-scoped)
  → new StoreXService($user?, $organization)
      → CalcXService::calculate($data)   (pure totals math, if money is involved)
      → XValidator::validate($data)      (domain rules)
      → persists model(s), associating organization/company first
  → return JSON
```

## Controllers — keep them thin

Mirror `SaleController`. Read the tenant from the **request, not the header** (the middleware injected it): `$request->organization`. For company-scoped records read `$request->header('x-company-id')`.

Wrap writes in a manual transaction and re-throw `ValidationException` so the framework still returns 422:

```php
public function store(StoreSaleRequest $request)
{
    try {
        $organization = $request->organization;
        $companyId    = $request->header('x-company-id');
        $user         = Auth::user();

        DB::beginTransaction();

        $data = SaleDataFactory::create($organization, [
            ...$request->all(),
            'company' => ['id' => $companyId],
        ]);

        $sale = (new StoreSaleService($user, $organization))->store($data);

        DB::commit();
        return response()->json($sale, 201);
    } catch (ValidationException $e) {
        DB::rollBack();
        throw $e;                       // let Laravel format the 422
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['message' => 'Erro ao salvar venda', 'error' => $e->getMessage()], 500);
    }
}
```

Simple modules may return `compact('brands')` instead of `response()->json(...)` — both styles exist; match the neighbouring controllers in the module you're editing. `index` delegates filtering/pagination to the repository; `show` loads relations with `->load([...])` and returns 404 manually when not found.

`update` reuses the same `Store…Request` and the same service `store($data, $id)` — there is usually no separate `Update…` class.

## Services — where the logic lives

- One service class per operation. Name by verb + subject: `StoreSaleService`, `ProcessSaleStockService`, `CalcSaleTotalsService`, `CancelStockMovementService`, `BulkCreateProductCompaniesService`.
- Constructor takes the ambient context (`User`, `Organization`) and stashes it on `protected` properties. The unit of work (`SaleData`) is passed to the public method, not the constructor.
- The public method reads as a high-level script of `protected`/`private` steps — keep each step a small focused method (`loadModels`, `validate`, `storeSale`, `storeSaleProducts`…). This is the house style; preserve it.
- `declare(strict_types=1);` is used on services. Type every parameter and return.
- Persist by **associating relations before `fill()`**, so foreign keys and tenancy are set explicitly:

```php
$sale->organization()->associate($this->organization);
$sale->company()->associate($this->saleData->company);
$sale->operation()->associate($this->saleData->operation);
$sale->fill($this->saleData->toArray());
$sale->save();
```

- Re-saving child collections (products, payments) on update: `delete()` the existing hasMany then recreate from the DTO. Detect update with a small `isUpdate()` helper, not scattered `if ($id)`.
- A service may call other services (`StoreSaleService` → `CalcSaleService`, `StoreOnSaleCommissionsService`). Compose; don't inline another module's rules.

## Data / DTOs — Spatie laravel-data

DTOs (`spatie/laravel-data`) carry typed, validated data between layers. Conventions seen in `SaleData`:

- Extend `Spatie\LaravelData\Data`, declare everything as promoted constructor params.
- **Required first, then optional with defaults.** Group with comments (`// --- OBRIGATÓRIOS ---`).
- Property names are `snake_case` to match the JSON payload and the DB columns (`sale_products`, `general_discount`).
- Typed model instances as properties (`Company $company`, `?Customer $customer`) — the factory resolves IDs into real models.
- Collections of child DTOs use `#[DataCollectionOf(SaleProductData::class)] public array $sale_products`.
- Money fields are `int` (cents) and default to `0`. Use a `setDefaults()` called from the constructor for things like `$this->saved_at ??= now();`.

### DataFactory — the boundary that enforces tenancy

`XDataFactory::create(Organization $organization, array $data): XData` turns the raw request array into a DTO and **loads every related model scoped to the organization**:

```php
$data['company']  = Company::organizationId($organization->id)->findOrFail($data['company']['id'] ?? null);
$data['customer'] = $customerId ? Customer::organizationId($organization->id)->findOrFail($customerId) : null;
// …
return SaleData::from($data);
```

This is the single most important tenancy guard: never load a related record by bare `find($id)` in a factory or service — always `Model::organizationId($organization->id)->findOrFail(...)`. `findOrFail` (404) is the default; required vs nullable mirrors the DTO.

## Repositories — list/show queries

`new XRepository($organization)` builds a base query already filtered by `organization_id` and eager-loads the common relations. Public methods: `filter(array $request)` (guarded `if (!empty($request['x']))` blocks), `paginate(int $perPage = 15)`, `findById($id)`. Free-text search goes through a model `scopeSearch` (uses `ilike` — this is PostgreSQL). See `SaleRepository`.

## Validators — domain rules

FormRequest validation covers shape/types. **Cross-field business rules** (max discount, payments must equal total, stock availability) live in `app/Erp/<Module>/Validators/`. Each validator is a static class implementing the module `…ValidatorContract` (`public static function validate(XData $data): void`) and throws `ValidationException` on failure. A coordinator `XValidator` holds an array of validator classes and runs them in order; the service calls only the coordinator.

## Models

- Flat in `app/Models/`. Compose tenancy/behaviour via traits: `HasOrganization` (gives `organization()` + `scopeOrganizationId`), `HasCompany`, `HasUuid`, `HasCode`, plus `HasFactory`.
- `HasCode` auto-assigns a per-tenant sequential number on `creating` (max+1 within the org). Set `protected $codeColumn = 'number';` to change the column.
- Declare `$fillable`, default `$attributes` (money cols default `0`), and `$casts`. **Cast money columns to `integer` and status columns to their enum** (`'status' => SaleStatus::class`). Decimals use `decimal:10`.
- `scopeOrganizationId` is the canonical tenant filter; prefer it over hand-written `where('organization_id', …)` in new code.

## Money — always integer cents

All monetary values are stored and computed as **integers in cents** (`product_total`, `net_total`, `amount`, …). The frontend sends cents; DB columns are integer; DTOs and casts are `int`. Never use floats for money. When you must parse a human/string amount, use `App\Helpers\MoneyHelper::toCents()` (handles `"1.234,56"` BR format). Totals math belongs in a `Calc…Service`, kept pure (DTO in → DTO out).

## Enums

String-backed PHP enums under `app/Erp/<Module>/Enums/` (e.g. `SaleStatus: string`) or, for permissions, `app/Enums/PermissionName.php`. Cast them on the model so the app always works with enum instances.

## Authorization

In the FormRequest's `authorize()`, gate by permission using the `PermissionName` enum and the org id from the header:

```php
$organizationId = (int) $this->header('X-Organization-Id');
if ($this->isMethod('post')) {
    Gate::authorize('permission', [PermissionName::SALE_CREATE->value, $organizationId]);
}
```

Gates `permission` / `anyPermission` / `allPermissions` are defined in `GateServiceProvider`. Platform-admin routes use the `system_admin` middleware alias.

## Routing

Add routes in `routes/api.php`. ERP modules go **inside** the `auth:sanctum` → `OrganizationAuthMiddleware` group, in a `['prefix' => '<module>', 'namespace' => '<Module>']` block. The `namespace` must match the controller's sub-namespace under `App\Http\Controllers\Erp` (wired in `bootstrap/app.php`; Laravel 11 has no RouteServiceProvider). Routes use string controller refs (`Route::resource('sale', 'SaleController')`).

## Tests

PHPUnit (not Pest). SQLite `:memory:`, so tests run on SQLite while prod is PostgreSQL — avoid PG-only SQL in code paths under test. Conventions:

- Unit tests for services/factories live at `tests/Unit/Erp/<Module>/...`; feature/HTTP tests at `tests/Feature/`.
- Use `RefreshDatabase`. Build the world with factories in `setUp()` — always create `User` → `Organization` → `OrganizationUser`, then company/operation/etc., passing `'organization_id' => $this->organization->id` so fixtures are tenant-consistent.
- When a test needs the standard authed-user-in-an-org scaffold, extend `Tests\OrganizationTestCase` (it sets `$this->user/$organization/$organizationUser` for you) instead of repeating it.
- Run: `php artisan test`, single class `php artisan test --filter StoreSaleService`, a folder `php artisan test tests/Unit/Erp/Sale`.

## Style

- `composer dev` runs serve + queue + logs + vite together; format with `./vendor/bin/pint` before committing.
- User-facing strings (validation messages, error JSON) are **Portuguese**; code identifiers are English.
- Match the surrounding file: spacing between statements is generous in this codebase, and docblocks on service methods are common — don't fight the local style.

## Checklist for a new CRUD module

1. Migration + `app/Models/<Model>.php` with `HasOrganization` (+ `HasCode`/`HasCompany`/`HasUuid` as needed), `$fillable`, `$casts` (money→int, status→enum).
2. `app/Erp/<Module>/Data/<Module>Data.php` (DTO) + `<Module>DataFactory.php` (loads relations org-scoped via `findOrFail`).
3. `app/Erp/<Module>/Services/Store<Module>Service.php` (+ `Calc…` if there are totals).
4. `app/Erp/<Module>/Repository/<Module>Repository.php` for index/show.
5. `app/Http/Requests/Erp/<Module>/Store<Module>Request.php` — `authorize()` via Gate + `rules()` + pt-BR `messages()`.
6. `app/Http/Controllers/Erp/<Module>/<Module>Controller.php` — thin, transaction-wrapped.
7. Route block in `routes/api.php` inside the org-auth group.
8. Tests under `tests/Unit/Erp/<Module>/` and/or `tests/Feature/`.
