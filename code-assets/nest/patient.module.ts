import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { Patient } from './entities';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    SequelizeModule.forFeature([Patient]),
    ClientsModule.register([
      {
        name: 'GENERATOR_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: 'patientRegister',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}
