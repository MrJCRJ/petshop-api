// src/pedidos/pedidos.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from '../dtos/create-pedido.dto';
import { UpdatePedidoDto } from '../dtos/update-pedido.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('pedidos')
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo pedido' })
  @ApiResponse({ status: 201, description: 'Pedido criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidosService.create(createPedidoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os pedidos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pedidos retornada com sucesso',
  })
  async findAll() {
    return this.pedidosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtém um pedido pelo ID' })
  @ApiResponse({ status: 200, description: 'Pedido retornado com sucesso' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.pedidosService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um pedido pelo ID' })
  @ApiResponse({ status: 200, description: 'Pedido atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  async update(
    @Param('id') id: string,
    @Body() updatePedidoDto: UpdatePedidoDto,
  ) {
    return this.pedidosService.update(id, updatePedidoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove um pedido pelo ID' })
  @ApiResponse({ status: 204, description: 'Pedido removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  async remove(@Param('id') id: string) {
    await this.pedidosService.remove(id);
  }
}
