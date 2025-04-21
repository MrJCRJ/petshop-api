import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pedido } from '../schemas/pedido.schema';
import { Fornecedor } from '../../fornecedores/schemas/fornecedor.schema';
import { CreatePedidoDto } from '../dtos/create-pedido.dto';
import { UpdatePedidoDto } from '../dtos/update-pedido.dto';

@Injectable()
export class PedidosService {
  constructor(
    @InjectModel(Pedido.name) private pedidoModel: Model<Pedido>,
    @InjectModel(Fornecedor.name) private fornecedorModel: Model<Fornecedor>,
  ) {}

  async create(createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    await this.verificarFornecedorExistente(createPedidoDto.fornecedorCnpj);

    const pedidoData = {
      ...createPedidoDto,
      valorTotal: createPedidoDto.quantidade * createPedidoDto.valorUnitario,
      data: new Date(createPedidoDto.data),
    };

    const createdPedido = new this.pedidoModel(pedidoData);
    return createdPedido.save();
  }

  private async verificarFornecedorExistente(cnpj: string): Promise<void> {
    const fornecedor = await this.fornecedorModel.findOne({ cnpj }).exec();
    if (!fornecedor) {
      throw new NotFoundException(`Fornecedor com CNPJ ${cnpj} não encontrado`);
    }
  }

  async update(id: string, updatePedidoDto: UpdatePedidoDto): Promise<Pedido> {
    const pedidoExistente = await this.pedidoModel.findById(id).exec();
    if (!pedidoExistente) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }

    const quantidade = updatePedidoDto.quantidade ?? pedidoExistente.quantidade;
    const valorUnitario =
      updatePedidoDto.valorUnitario ?? pedidoExistente.valorUnitario;
    const valorTotal = quantidade * valorUnitario;

    const updated = await this.pedidoModel
      .findByIdAndUpdate(
        id,
        {
          ...updatePedidoDto,
          valorTotal,
        },
        { new: true },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException(
        `Pedido com ID ${id} não encontrado após atualização`,
      );
    }

    return updated;
  }
}
