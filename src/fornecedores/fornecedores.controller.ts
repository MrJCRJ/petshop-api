// src/fornecedores/fornecedores.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FornecedoresService } from './fornecedores.service';
import { Fornecedor } from './schemas/fornecedor.schema';
import { CreateFornecedorDto } from './dtos/create-fornecedor.dto';
import { UpdateFornecedorDto } from './dtos/update-fornecedor.dto';

@Controller('fornecedores')
export class FornecedoresController {
  constructor(private readonly fornecedoresService: FornecedoresService) {}

  @Post()
  async create(
    @Body() createFornecedorDto: CreateFornecedorDto,
  ): Promise<Fornecedor> {
    return this.fornecedoresService.create(createFornecedorDto);
  }

  @Get()
  async findAll(): Promise<Fornecedor[]> {
    return this.fornecedoresService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Fornecedor> {
    return this.fornecedoresService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFornecedorDto: UpdateFornecedorDto,
  ): Promise<Fornecedor> {
    return this.fornecedoresService.update(id, updateFornecedorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<{ deleted: boolean }> {
    return this.fornecedoresService.remove(id);
  }
}
