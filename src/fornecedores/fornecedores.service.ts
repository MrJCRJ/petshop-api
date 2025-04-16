// src/fornecedores/fornecedores.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Fornecedor } from './schemas/fornecedor.schema';
import { CreateFornecedorDto } from './dtos/create-fornecedor.dto';

@Injectable()
export class FornecedoresService {
  constructor(
    @InjectModel(Fornecedor.name)
    private readonly fornecedorModel: Model<Fornecedor>,
  ) {}

  async create(createFornecedorDto: CreateFornecedorDto): Promise<Fornecedor> {
    try {
      const createdFornecedor = new this.fornecedorModel(createFornecedorDto);
      return await createdFornecedor.save();
    } catch (error) {
      // Adicione tratamento específico para erros de duplicação (por exemplo, CNPJ único)
      if (error === 11000) {
        throw new Error('Já existe um fornecedor com este CNPJ');
      }
      // Log do erro completo para debug
      console.error('Erro ao criar fornecedor:', error);
      throw new Error('Falha ao criar fornecedor');
    }
  }

  async findAll(): Promise<Fornecedor[]> {
    return this.fornecedorModel.find().exec();
  }

  async findOne(id: string): Promise<Fornecedor> {
    const fornecedor = await this.fornecedorModel.findById(id).exec();
    if (!fornecedor) {
      throw new NotFoundException(`Fornecedor com ID ${id} não encontrado`);
    }
    return fornecedor;
  }

  async update(
    id: string,
    updateFornecedorDto: Partial<CreateFornecedorDto>,
  ): Promise<Fornecedor> {
    const updatedFornecedor = await this.fornecedorModel
      .findByIdAndUpdate(id, updateFornecedorDto, { new: true })
      .exec();

    if (!updatedFornecedor) {
      throw new NotFoundException(`Fornecedor com ID ${id} não encontrado`);
    }
    return updatedFornecedor;
  }

  async delete(id: string): Promise<{ deleted: boolean }> {
    const result = await this.fornecedorModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Fornecedor com ID ${id} não encontrado`);
    }
    return { deleted: true };
  }
}
