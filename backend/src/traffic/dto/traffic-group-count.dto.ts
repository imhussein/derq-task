import { ApiProperty } from '@nestjs/swagger';

export class TrafficGroupCountDto {
  @ApiProperty({
    example: 'United Arab Emirats',
  })
  group: string;

  @ApiProperty({
    example: 1284,
  })
  count: number;
}
