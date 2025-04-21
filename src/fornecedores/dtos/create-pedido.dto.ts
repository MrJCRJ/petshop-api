import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsIn,
  Min,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePedidoDto {
  @ApiProperty({ example: 'Ração Premium', description: 'Nome do produto' })
  @IsNotEmpty()
  @IsString()
  produto: string;

  @ApiProperty({ example: 5, description: 'Quantidade do produto' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantidade: number;

  @ApiProperty({
    example: '2023-05-20',
    description: 'Data do pedido (YYYY-MM-DD)',
  })
  @IsNotEmpty()
  @IsDateString()
  data: string;

  @ApiProperty({ enum: ['Pendente', 'Entregue'], example: 'Pendente' })
  @IsNotEmpty()
  @IsIn(['Pendente', 'Entregue'])
  status: 'Pendente' | 'Entregue';

  @ApiProperty({ example: '12345678000195', description: 'CNPJ do fornecedor' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{14}$/, { message: 'CNPJ deve ter 14 dígitos' })
  fornecedorCnpj: string;

  @ApiProperty({ example: 89.9, description: 'Valor unitário do produto' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  valorUnitario: number;

  // Removido valorTotal - será calculado no servidor
}
