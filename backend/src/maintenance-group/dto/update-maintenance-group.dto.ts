import { PartialType } from '@nestjs/swagger';
import { CreateMaintenanceGroupDto } from './create-maintenance-group.dto';

export class UpdateMaintenanceGroupDto extends PartialType(CreateMaintenanceGroupDto) {}
