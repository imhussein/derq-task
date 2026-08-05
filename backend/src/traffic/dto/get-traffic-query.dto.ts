import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetTrafficQueryDto {
  @ApiPropertyOptional({
    example: 'United Arab Emirat',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  // This in production app should be enum check of allowed values not juist string check
  vehicleType?: string;
}
