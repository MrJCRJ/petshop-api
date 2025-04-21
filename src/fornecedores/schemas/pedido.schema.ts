// src/pedidos/schemas/pedido.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Pedido extends Document {
  @Prop({ required: true })
  produto: string;

  @Prop({ required: true })
  quantidade: number;

  @Prop({ required: true })
  data: Date;

  @Prop({ required: true, enum: ['Pendente', 'Entregue'] })
  status: string;

  @Prop({ required: true })
  fornecedorCnpj: string;

  @Prop({ required: true })
  valorUnitario: number;

  @Prop({ required: true })
  valorTotal: number;
}

export const PedidoSchema = SchemaFactory.createForClass(Pedido);
