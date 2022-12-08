import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { VaccineService } from './vaccine.service';
import { CreateVaccineDto, UpdateVaccineDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenPayload, Roles, User } from 'src/roles';
import { Role } from 'src/shared/role';

@Controller('vaccine')
@ApiTags('Vaccine')
export class VaccineController {
  constructor(private readonly vaccineService: VaccineService) {}

  @Post()
  async create(@Body() dto: CreateVaccineDto) {
    return await this.vaccineService.create(dto);
  }

  @Get('me')
  @Roles(Role.patient)
  findAllbyPatient(
    @User() user: AccessTokenPayload,
    @Query('limit') limit?: number,
    @Query('searchQuery') search?: string,
  ) {
    return this.vaccineService.findAll(user.userId, limit, search);
  }

  @Get()
  findAll() {
    return this.vaccineService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vaccineService.findOne(id);
  }

  @Roles(Role.patient, Role.familyPractitioner)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVaccineDto,
    @User() user: AccessTokenPayload,
  ) {
    return this.vaccineService.update(id, dto, user.userId);
  }

  @Roles(Role.patient, Role.familyPractitioner)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @User() user: AccessTokenPayload) {
    return this.vaccineService.remove(id, user.userId);
  }
}
