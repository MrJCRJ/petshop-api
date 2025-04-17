// src/fornecedores/dto/update-fornecedor.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateFornecedorDto } from './create-fornecedor.dto';

export class UpdateFornecedorDto extends PartialType(CreateFornecedorDto) {}
