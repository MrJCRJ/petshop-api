import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('health')
@ApiTags('Verificação de Saúde')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Verificar o status de saúde do backend' })
  @ApiResponse({
    status: 200,
    description: 'Backend está saudável e funcionando',
  })
  @ApiResponse({
    status: 503,
    description: 'Backend está com problemas',
  })
  verificarSaude() {
    // Aqui você pode adicionar verificações adicionais
    // como conexão com banco de dados, serviços externos, etc.
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      mensagem: 'Serviço operando normalmente',
    };
  }
}
