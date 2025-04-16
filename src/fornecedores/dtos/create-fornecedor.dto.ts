// src/fornecedores/dtos/create-fornecedor.dto.ts
export class CreateFornecedorDto {
  nome: string;
  cnpj: string;
  telefone: string;
  email?: string;
  endereco?: string;
  tipoRacao?: string[];
  prazoEntrega?: string;
  condicoesPagamento?: string;
  observacoes?: string;
}
