import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { DeclarationService } from './declaration.service';
import { CreateDeclarationDto, UpdateDeclarationDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '../shared/role';
import { AccessTokenPayload, Roles, User } from '../roles';
import { DeclarationStatus } from '../shared/declaration';
import { ChatService } from 'src/chat/chat.service';

@Controller('declaration')
@ApiTags('Declaration')
export class DeclarationController {
  constructor(
    private readonly declarationService: DeclarationService,
    @Inject(ChatService) private readonly chatService: ChatService,
  ) {}

  @Get()
  @Roles(Role.admin)
  findAll() {
    return this.declarationService.findAll();
  }
  @Get('patient/:patient_id')
  findbyPatientId(@Param('patient_id', ParseIntPipe) patient_id: number) {
    return this.declarationService.findByPatientId(patient_id);
  }

  @Get('me')
  @Roles(Role.familyPractitioner, Role.patient)
  findByUser(
    @Query('sort') sort: string,
    @Query('filter') filter: string,
    @Query('status') status: DeclarationStatus,
    @Query('limit') limit: number,
    @User() user: AccessTokenPayload,
  ) {
    return this.declarationService.findByUser(user.role, user.userId, filter, sort, status, limit);
  }

  @Get('me/all')
  @Roles(Role.patient)
  findByUserId(@User() user: AccessTokenPayload) {
    return this.declarationService.findByUserId(user.userId);
  }

  @Get('my-patients')
  @Roles(Role.familyPractitioner)
  findMyPatients(
    @Query('status') status: string,
    @Query('sortBy') sort: string,
    @Query('searchQuery') search: string,
    @Query('limit', ParseIntPipe) limit: number,
    @User() user: AccessTokenPayload,
  ) {
    return this.declarationService.findMyPatients(user.userId, status, sort, search, limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.declarationService.findOne(id);
  }

  @Post()
  @Roles(Role.patient)
  create(@Body() createDeclarationDto: CreateDeclarationDto, @User() user: AccessTokenPayload) {
    return this.declarationService.create(createDeclarationDto, user.userId);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDeclarationDto: UpdateDeclarationDto,
  ) {
    if (updateDeclarationDto.status === DeclarationStatus.Accepted) {
      const declaration = await this.declarationService.findOne(id);
      await this.chatService.create(declaration.id);
    }

    return await this.declarationService.update(id, updateDeclarationDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.declarationService.remove(id);
  }
}
