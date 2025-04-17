// src/fornecedores/dto/create-fornecedor.dto.ts
import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';

export class CreateFornecedorDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsNotEmpty()
  @IsString()
  cnpj: string;

  @IsNotEmpty()
  @IsString()
  telefone: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  endereco?: string;

  @IsOptional()
  @IsArray()
  tipoRacao?: string[];

  @IsOptional()
  @IsString()
  prazoEntrega?: string;

  @IsOptional()
  @IsString()
  condicoesPagamento?: string;

  @IsOptional()
  @IsString()
  observacoes?: string;
}
