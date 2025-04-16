import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  ConflictException, // Adicione esta linha
  InternalServerErrorException, // Adicione esta linha
} from '@nestjs/common';
import { ClientsService } from '../clients.service';
import { CreateClientDto } from '../dtos/create-client.dto';
import { UpdateClientDto } from '../dtos/update-client.dto';
import { Cliente } from '../schemas/client.schema';

import { SyncOperation, SyncResponse } from '../../shared/sync.types';

@Controller('clientes')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  async create(@Body() createClientDto: CreateClientDto): Promise<Cliente> {
    try {
      return await this.clientsService.create(createClientDto);
    } catch (error) {
      // Handle duplicate key error specifically
      if (error === 11000) {
        throw new ConflictException('Já existe um cliente com este documento');
      }
      // Log the actual error for debugging
      console.error('Erro ao criar cliente:', error);
      throw new InternalServerErrorException('Falha ao criar cliente');
    }
  }

  @Get()
  async findAll(): Promise<Cliente[]> {
    return this.clientsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Cliente> {
    const cliente = await this.clientsService.findOne(id);
    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }
    return cliente;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<Cliente> {
    const cliente = await this.clientsService.update(id, updateClientDto);
    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado para atualização');
    }
    return cliente;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('id') id: string,
  ): Promise<{ deletedId: string; message: string }> {
    return this.clientsService.delete(id);
  }

  @Post('sync')
  async sync(
    @Body() body: { clientes: SyncOperation[] },
  ): Promise<SyncResponse> {
    return this.clientsService.sync(body.clientes);
  }
}
