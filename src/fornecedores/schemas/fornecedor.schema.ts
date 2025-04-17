// src/fornecedores/schemas/fornecedor.schema.ts
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
export class Fornecedor extends Document {
  @Prop({ required: true })
  nome: string;

  @Prop({ required: true, unique: true })
  cnpj: string;

  @Prop({ required: true })
  telefone: string;

  @Prop()
  email: string;

  @Prop()
  endereco: string;

  @Prop([String])
  tipoRacao: string[];

  @Prop()
  prazoEntrega: string;

  @Prop()
  condicoesPagamento: string;

  @Prop()
  observacoes: string;
}

export const FornecedorSchema = SchemaFactory.createForClass(Fornecedor);
