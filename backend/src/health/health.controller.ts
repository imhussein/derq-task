import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor() {}

  @ApiOperation({
    summary:
      'Health check which is liveness and readiness status for the server',
  })
  @Get()
  checkServerStatus() {
    return { status: 'ok' };
  }
}
