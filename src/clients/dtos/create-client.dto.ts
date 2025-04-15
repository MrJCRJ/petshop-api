import {
  IsEnum,
  IsNotEmpty,
  IsString,
  Validate,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsValidDocument } from '../../common/validators/document.validator';
import { IsValidPhone } from '../../common/validators/phone.validator';

export class EnderecoDto {
  @IsOptional()
  @IsString()
  cep?: string;

  @IsOptional()
  @IsString()
  logradouro?: string;

  @IsOptional()
  @IsString()
  numero?: string;

  @IsOptional()
  @IsString()
  bairro?: string;

  @IsOptional()
  @IsString()
  localidade?: string;

  @IsOptional()
  @IsString()
  uf?: string;

  @IsOptional()
  @IsString()
  complemento?: string;
}

export class CreateClientDto {
  @IsNotEmpty()
  @IsEnum(['petshop', 'mercadinho', 'clínica', 'outro'] as const)
  tipo: string;

  @IsNotEmpty()
  @IsString()
  nomeFantasia: string;

  @IsOptional()
  @IsString()
  razaoSocial?: string;

  @IsNotEmpty()
  @Validate(IsValidDocument)
  documento: string;

  @IsOptional()
  @IsString()
  responsavel?: string;

  @IsNotEmpty()
  @Validate(IsValidPhone)
  telefone: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @Type(() => EnderecoDto)
  endereco?: EnderecoDto;

  @IsOptional()
  @IsString()
  observacoes?: string;
}
