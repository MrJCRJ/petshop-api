import { PartialType } from '@nestjs/mapped-types';
import { CreatePedidoDto } from './create-pedido.dto';
import { IsOptional, IsNumber, Min } from 'class-validator';

export class UpdatePedidoDto extends PartialType(CreatePedidoDto) {
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  valorUnitario?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  quantidade?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  valorTotal?: number;
}
