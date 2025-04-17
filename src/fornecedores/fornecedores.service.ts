// src/fornecedores/fornecedores.service.ts
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Fornecedor } from './schemas/fornecedor.schema';
import { CreateFornecedorDto } from './dtos/create-fornecedor.dto';
import { UpdateFornecedorDto } from './dtos/update-fornecedor.dto';

@Injectable()
export class FornecedoresService {
  constructor(
    @InjectModel(Fornecedor.name)
    private readonly fornecedorModel: Model<Fornecedor>,
  ) {}

  async create(createFornecedorDto: CreateFornecedorDto): Promise<Fornecedor> {
    try {
      // Remove formatação do CNPJ antes de salvar
      const cnpjLimpo = createFornecedorDto.cnpj.replace(/\D/g, '');
      const fornecedorData = {
        ...createFornecedorDto,
        cnpj: cnpjLimpo,
      };

      const createdFornecedor = new this.fornecedorModel(fornecedorData);
      return await createdFornecedor.save();
    } catch (error: unknown) {
      console.error('Erro detalhado:', error);

      // Verifica se é um erro de duplicação (código 11000 do MongoDB)
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 11000
      ) {
        throw new InternalServerErrorException('CNPJ já cadastrado');
      }

      throw new InternalServerErrorException('Falha ao criar fornecedor');
    }
  }

  async findAll(): Promise<Fornecedor[]> {
    return this.fornecedorModel.find().exec();
  }

  async findOne(id: string): Promise<Fornecedor> {
    const fornecedor = await this.fornecedorModel.findById(id).exec();
    if (!fornecedor) {
      throw new NotFoundException('Fornecedor não encontrado');
    }
    return fornecedor;
  }

  async update(
    id: string,
    updateFornecedorDto: UpdateFornecedorDto,
  ): Promise<Fornecedor> {
    const updated = await this.fornecedorModel
      .findByIdAndUpdate(id, updateFornecedorDto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException('Fornecedor não encontrado');
    }
    return updated;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.fornecedorModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Fornecedor não encontrado');
    }
    return { deleted: true };
  }
}
