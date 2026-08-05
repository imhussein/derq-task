import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { GetTrafficQueryDto } from './dto/get-traffic-query.dto';
import { TrafficGroupCountDto } from './dto/traffic-group-count.dto';
import { UpdateTrafficDto } from './dto/update-traffic.dto';
import { Traffic } from './entities/traffic.entity';
import { TraficService } from './traffic.service';

@ApiTags('traffic')
@Controller('traffic')
export class TrafficController {
  constructor(private readonly traficService: TraficService) {}

  @ApiOperation({ summary: 'Fetch all records' })
  @ApiOkResponse({ type: Traffic, isArray: true })
  @Get()
  getAll() {
    return this.traficService.fetchAll();
  }

  @ApiOperation({ summary: 'Get total vehicles counts grouped by countryies' })
  @ApiOkResponse({ type: TrafficGroupCountDto, isArray: true })
  @Get('by-country')
  getByCountry(@Query() query: GetTrafficQueryDto) {
    return this.traficService.fetchByCountry(query);
  }

  @ApiOperation({
    summary: 'Get total vehicle counts grouped by vehicles types',
  })
  @ApiOkResponse({ type: TrafficGroupCountDto, isArray: true })
  @Get('by-vehicle-type')
  getByVehicleType(@Query() query: GetTrafficQueryDto) {
    return this.traficService.getByVehicleType(query);
  }

  @ApiOperation({ summary: 'Update a record' })
  @ApiParam({
    name: 'id',
    description: 'this is the record id',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @ApiOkResponse({ type: Traffic })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTrafficDto) {
    return this.traficService.updateRecord(id, dto);
  }
}
