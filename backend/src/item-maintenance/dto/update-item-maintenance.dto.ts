import { PartialType } from '@nestjs/swagger';
import { CreateItemMaintenanceDto } from './create-item-maintenance.dto';

export class UpdateItemMaintenanceDto extends PartialType(CreateItemMaintenanceDto) {}
