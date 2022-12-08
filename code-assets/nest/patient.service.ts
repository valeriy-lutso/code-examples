import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { Bmi } from 'src/bmi';
import { ContactPerson } from 'src/contact-person';
import { Declaration } from 'src/declaration/entities/declaration.entity';

import { InsurancePolicy } from 'src/insurancePolicy';
import { MedicalInfo } from 'src/medical-info';
import { PersonalInfo } from 'src/personal-info/entities/personal-info.entity';
import { Relative } from 'src/relative';
import { Vaccine } from 'src/vaccine';
import { Visit } from 'src/visit';
import { VisitReport } from 'src/visit-report';
import { User } from 'src/user';

import { CreatePatientDto, UpdateNotificationsSettingsDto } from './dto';
import { Patient } from 'src/patient/entities/patient.entity';
import { PatientServiceException, PatientNotFoundException } from './exceptions';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient) private patientRepository: typeof Patient,
    @Inject('GENERATOR_CLIENT') private readonly generatorClient: ClientProxy,
  ) {}

  async create(createPatientDto: CreatePatientDto, transaction?: Transaction) {
    const patient = await this.patientRepository.create(createPatientDto, { transaction });

    await this.generatorClient.connect();
    this.generatorClient.emit('patientRegister', { id: patient.userId });

    return patient;
  }

  async findAll() {
    return this.patientRepository.findAll({ include: { all: true } });
  }

  async findOneWithDetails(id: number) {
    const patient = await this.patientRepository.findByPk(id, {
      attributes: ['address'],
      include: [
        {
          model: User,
          include: [
            {
              model: PersonalInfo,
              attributes: ['firstName', 'lastName', 'gender', 'phone', 'avatarImageUrl'],
            },
          ],
        },
        { model: ContactPerson, attributes: ['first_name', 'last_name', 'relation_type'] },
        {
          model: Relative,
          attributes: ['first_name', 'last_name', 'relation_type'],
        },
        { model: Bmi, attributes: ['height', 'weight'], limit: 1, order: [['createdAt', 'DESC']] },
        { model: MedicalInfo },
        { model: Vaccine },
        { model: Visit, include: [{ model: VisitReport }] },
        { model: InsurancePolicy },
        {
          model: Declaration,
          attributes: ['id', 'status'],
        },
      ],
    });

    if (patient === null) {
      throw new NotFoundException(`Patient with id ${id} not found`);
    }

    const { user, ...patientAttributes } = patient.toJSON();

    return { personalInfo: user.personalInfo, ...patientAttributes };
  }

  async remove(id: number) {
    const patient = await this.patientRepository.findOne({ where: { id } });
    if (!patient) throw new PatientServiceException('Remove error');
    else await patient.destroy();
  }

  async setAddress(userId: number, address: string) {
    const instance = await this.findOne(userId, ['userId', 'address']);

    if (instance === null) {
      return;
    }

    instance.address = address;

    return (await instance.save()).address;
  }

  async getAddress(userId: number) {
    const instance = await this.findOne(userId, ['address']);

    if (instance === null) {
      return;
    }

    return instance.address;
  }

  async findOne(userId: number, attributes?: string[]) {
    return await this.patientRepository.findByPk(userId, { attributes });
  }

  async getNotificationsSettings(userId: number) {
    const instance = await this.patientRepository.findByPk(userId, {
      attributes: [
        'getUpcomingVisitsReminders',
        'getDeclarationTerminationProposals',
        'getRecommendations',
        'getFillDataReminders',
      ],
    });

    if (instance === null) {
      throw new PatientNotFoundException();
    }

    return {
      getUpcomingVisitsReminders: instance.getUpcomingVisitsReminders,
      getDeclarationTerminationProposals: instance.getDeclarationTerminationProposals,
      getRecommendations: instance.getRecommendations,
      getFillDataReminders: instance.getFillDataReminders,
    };
  }

  async setNotificationsSettings(userId: number, settingsUpdate: UpdateNotificationsSettingsDto) {
    const instance = await this.patientRepository.findByPk(userId, {
      attributes: ['userId'],
    });

    if (instance === null) {
      throw new PatientNotFoundException();
    }

    await instance.update(settingsUpdate);

    return {
      getUpcomingVisitsReminders: instance.getUpcomingVisitsReminders,
      getDeclarationTerminationProposals: instance.getDeclarationTerminationProposals,
      getRecommendations: instance.getRecommendations,
      getFillDataReminders: instance.getFillDataReminders,
    };
  }
}
