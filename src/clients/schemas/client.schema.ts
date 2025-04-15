import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

interface ValidationMessageProps {
  value: string;
  path: string;
}

@Schema({ timestamps: true })
export class Endereco {
  @Prop({ match: [/^\d{5}-?\d{3}$/, 'CEP inválido'] })
  cep?: string;

  @Prop()
  logradouro?: string;

  @Prop()
  numero?: string;

  @Prop()
  bairro?: string;

  @Prop()
  localidade?: string;

  @Prop({ uppercase: true, minlength: 2, maxlength: 2 })
  uf?: string;

  @Prop()
  complemento?: string;

  @Prop({ type: [Number], index: '2dsphere' })
  coordenadas?: number[];
}

@Schema({
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id; // Garante que o id será retornado como string
      delete ret._id;
      delete ret.__v;
    },
  },
})
export class Cliente extends Document {
  @Prop({
    required: true,
    enum: ['petshop', 'mercadinho', 'clínica', 'outro'],
  })
  tipo: string;

  @Prop({ required: true, trim: true })
  nomeFantasia: string;

  @Prop({ trim: true })
  razaoSocial?: string;

  @Prop({
    required: true,
    unique: true,
    validate: {
      validator: (v: string) =>
        /^(\d{3}\.?\d{3}\.?\d{3}-?\d{2}|\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2})$/.test(
          v,
        ),
      message: (props: ValidationMessageProps) =>
        `${props.value} não é um documento válido!`,
    },
  })
  documento: string;

  @Prop({ trim: true })
  responsavel?: string;

  @Prop({
    required: true,
    validate: {
      validator: (v: string) =>
        /^(\+\d{1,3}?)?\s*(\(?\d{2}\)?)?\s*(\d{4,5}-?\d{4})$/.test(v),
      message: (props: ValidationMessageProps) =>
        `${props.value} não é um telefone válido!`,
    },
  })
  telefone: string;

  @Prop({
    lowercase: true,
    validate: {
      validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: (props: ValidationMessageProps) =>
        `${props.value} não é um e-mail válido!`,
    },
  })
  email?: string;

  @Prop({ type: Endereco })
  endereco?: Endereco;

  @Prop()
  observacoes?: string;

  @Prop({ enum: ['ativo', 'inativo', 'pendente'], default: 'ativo' })
  status?: string;

  @Prop({ type: [String] })
  tags?: string[];

  @Prop({ default: false })
  pendingSync?: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ClienteSchema = SchemaFactory.createForClass(Cliente);

// Índices
ClienteSchema.index({ documento: 1 }, { unique: true });
ClienteSchema.index({ nomeFantasia: 'text', razaoSocial: 'text' });

// Middleware para padronização
ClienteSchema.pre<Cliente>('save', function (next) {
  if (this.documento) {
    this.documento = this.documento.replace(/\D/g, '');
  }
  this.updatedAt = new Date();
  next();
});
