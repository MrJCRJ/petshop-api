import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose'; // Adicionei Types aqui
import { Cliente } from './schemas/client.schema';
import { CreateClientDto } from './dtos/create-client.dto';
import { UpdateClientDto } from './dtos/update-client.dto';
import {
  SyncOperation,
  SyncResponse,
  SyncResult,
  SyncSuccessResult,
  SyncErrorResult,
} from '../shared/sync.types';

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Cliente.name) private readonly clienteModel: Model<Cliente>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Cliente> {
    const createdCliente = new this.clienteModel(createClientDto);
    return createdCliente.save();
  }

  async findAll(): Promise<Cliente[]> {
    return this.clienteModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Cliente | null> {
    if (!Types.ObjectId.isValid(id)) {
      // Corrigido com a importação de Types
      return null;
    }
    return this.clienteModel.findById(id).exec();
  }

  async update(
    id: string,
    updateClientDto: UpdateClientDto,
  ): Promise<Cliente | null> {
    if (!Types.ObjectId.isValid(id)) {
      // Corrigido com a importação de Types
      return null;
    }
    return this.clienteModel
      .findByIdAndUpdate(
        id,
        { ...updateClientDto, updatedAt: new Date() },
        { new: true },
      )
      .exec();
  }

  async delete(id: string): Promise<{ deletedId: string; message: string }> {
    if (!Types.ObjectId.isValid(id)) {
      // Corrigido com a importação de Types
      throw new NotFoundException('ID inválido');
    }

    const result = await this.clienteModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Cliente não encontrado para exclusão');
    }
    return { deletedId: id, message: 'Cliente deletado com sucesso' };
  }

  async sync(clientes: SyncOperation[]): Promise<SyncResponse> {
    const results = await Promise.all(
      clientes.map(async (clienteData): Promise<SyncResult> => {
        try {
          const { action, ...cliente } = clienteData;
          const documento = cliente.documento.replace(/\D/g, '');

          const existing = await this.clienteModel
            .findOne({ documento })
            .exec();

          if (action === 'delete') {
            if (!existing) {
              return {
                status: 'not_found',
                documento,
                error: 'Cliente não encontrado para exclusão',
              } as SyncErrorResult;
            }
            await existing.deleteOne();
            const { documento: doc, ...rest } = existing.toObject(); // Corrige a duplicação
            return {
              id: existing._id,
              status: 'deleted',
              documento: doc,
              ...rest,
            } as SyncSuccessResult;
          }

          if (existing) {
            const updated = await this.clienteModel.findByIdAndUpdate(
              existing._id,
              { ...cliente, documento },
              { new: true },
            );
            if (!updated) {
              throw new Error('Falha ao atualizar cliente');
            }
            return updated;
          } else {
            const created = await this.clienteModel.create({
              ...cliente,
              documento,
            });
            return created;
          }
        } catch (error: unknown) {
          const err = error as Error;
          return {
            error: err.message,
            documento: clienteData.documento,
            details: err.stack,
          } as SyncErrorResult;
        }
      }),
    );

    const errors = results.filter((r): r is SyncErrorResult => 'error' in r);
    const successCount = results.length - errors.length;

    return {
      success: errors.length === 0,
      syncedItems: results.length,
      successCount,
      errorCount: errors.length,
      errors: errors.length > 0 ? errors : undefined,
    };
  }
}
