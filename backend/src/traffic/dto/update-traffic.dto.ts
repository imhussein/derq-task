import { IsInt, Min } from 'class-validator';

export class UpdateTrafficDto {
  @IsInt()
  @Min(0)
  vehicleCount: number;
}
