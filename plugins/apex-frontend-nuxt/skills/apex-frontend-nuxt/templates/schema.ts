// app/schemas/<domain>.ts — schema Zod do form (validação + tipo via z.infer).
import { z } from 'zod'

export const resourceSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  // ...um campo por input do form, com mensagem em pt-BR
})

// Tipo do INPUT do form, gerado pelo schema (não confundir com a entidade).
export type ResourceFormInput = z.infer<typeof resourceSchema>
