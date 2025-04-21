// src/pedidos/dto/create-pedido.dto.ts
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsIn,
} from 'class-validator';

export class CreatePedidoDto {
  @IsNotEmpty()
  @IsString()
  produto: string;

  @IsNotEmpty()
  @IsNumber()
  quantidade: number;

  @IsNotEmpty()
  @IsDateString()
  data: string;

  @IsNotEmpty()
  @IsIn(['Pendente', 'Entregue'])
  status: 'Pendente' | 'Entregue';

  @IsNotEmpty()
  @IsString()
  fornecedorCnpj: string;

  @IsNotEmpty()
  @IsNumber()
  valorUnitario: number;

  @IsNotEmpty()
  @IsNumber()
  valorTotal: number;
}
