import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pedido } from '../schemas/pedido.schema';
import { CreatePedidoDto } from '../dtos/create-pedido.dto';
import { UpdatePedidoDto } from '../dtos/update-pedido.dto';

@Injectable()
export class PedidosService {
  constructor(@InjectModel(Pedido.name) private pedidoModel: Model<Pedido>) {}

  async create(createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    // Calcula o valor total automaticamente
    createPedidoDto.valorTotal =
      createPedidoDto.quantidade * createPedidoDto.valorUnitario;

    const createdPedido = new this.pedidoModel(createPedidoDto);
    return createdPedido.save();
  }

  async findAll(): Promise<Pedido[]> {
    return this.pedidoModel.find().exec();
  }

  async findOne(id: string): Promise<Pedido> {
    const pedido = await this.pedidoModel.findById(id).exec();
    if (!pedido) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }
    return pedido;
  }

  async update(id: string, updatePedidoDto: UpdatePedidoDto): Promise<Pedido> {
    // Recalcula o valor total se quantidade ou valorUnitário foram alterados
    if (updatePedidoDto.quantidade || updatePedidoDto.valorUnitario) {
      const pedidoExistente = await this.findOne(id);
      updatePedidoDto.valorTotal =
        (updatePedidoDto.quantidade || pedidoExistente.quantidade) *
        (updatePedidoDto.valorUnitario || pedidoExistente.valorUnitario);
    }

    const pedido = await this.pedidoModel
      .findByIdAndUpdate(id, updatePedidoDto, { new: true })
      .exec();

    if (!pedido) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }
    return pedido;
  }

  async remove(id: string): Promise<void> {
    const result = await this.pedidoModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }
  }
}
