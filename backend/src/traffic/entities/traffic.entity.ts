import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

// i added this index to match findAll sort (timestamp DESC, id ASC), id is tiebreaker because seed rows have almost same timestamp so order stay stable and query stay fast when table grow
@Index(['timestamp', 'id'])
@Entity('traffic')
export class Traffic {
  @ApiProperty({
    description: 'Record ids',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  country: string;

  @ApiProperty({ description: 'The vehicle Type', example: 'car' })
  @Index()
  @Column()
  vehicleType: string;

  @ApiProperty({ description: 'the Number of vehicles', example: 42 })
  @Column()
  count: number;

  @Column({ type: 'timestamp' })
  timestamp: Date;
}
