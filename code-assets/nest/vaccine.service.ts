import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Declaration } from 'src/declaration/entities';
import { AppBadRequestException } from 'src/exceptions/app-bad-request';
import { Patient } from 'src/patient';
import { DeclarationStatus } from 'src/shared/declaration';

import { CreateVaccineDto, UpdateVaccineDto } from './dto';
import { Vaccine } from './entities';

@Injectable()
export class VaccineService {
  constructor(@InjectModel(Vaccine) private vaccineRepository: typeof Vaccine) {}

  async create(createVaccineDto: CreateVaccineDto) {
    return await this.vaccineRepository.create(createVaccineDto);
  }

  async findAll(patient_id = null, limit?: number, search?: string) {
    if (patient_id) {
      const result = await this.vaccineRepository.findAndCountAll({
        where: {
          patient_id,
          name: { [Op.iLike]: '%' + search + '%' },
        },
        limit: limit,
      });
      return { vaccines: result.rows, totalRecords: result.count };
    } else {
      return this.vaccineRepository.findAll();
    }
  }

  async findOne(id: number) {
    const vaccine = await this.vaccineRepository.findByPk(id);

    if (vaccine === null) {
      this.throwVaccineNotFound(id);
    }

    return vaccine;
  }

  async update(id: number, updateVaccineDto: UpdateVaccineDto, userId?: number) {
    const vaccine = await this.vaccineRepository.findByPk(id, {
      include: [
        {
          model: Patient,
          include: [
            {
              model: Declaration,
              attributes: ['patient_id', 'practitioner_id'],
              where: { status: DeclarationStatus.Accepted },
            },
          ],
        },
      ],
    });
    const legalDecalaration = vaccine.patient.declarations.map(declaration => {
      return declaration.patient_id === userId || declaration.practitioner_id === userId;
    });
    if (legalDecalaration === undefined) {
      throw new AppBadRequestException("Current user doesn't have rights to perform this action");
    }

    return await this.vaccineRepository.update(updateVaccineDto, {
      where: { id },
    });
  }

  async remove(id: number, userId: number) {
    const vaccine = await this.vaccineRepository.findByPk(id, {
      include: [
        {
          model: Patient,
          include: [
            {
              model: Declaration,
              attributes: ['patient_id', 'practitioner_id'],
              where: { status: DeclarationStatus.Accepted },
            },
          ],
        },
      ],
    });
    const legalDecalaration = vaccine.patient.declarations.map(declaration => {
      return declaration.patient_id === userId || declaration.practitioner_id === userId;
    });
    if (legalDecalaration === undefined) {
      throw new AppBadRequestException("Current user doesn't have rights to perform this action");
    }
    return this.vaccineRepository.destroy({ where: { id } });
  }

  private async checkIfVaccineExist(id: number) {
    const vaccine = await this.vaccineRepository.findByPk(id);

    if (vaccine === null) {
      this.throwVaccineNotFound(id);
    }
  }

  private throwVaccineNotFound(id: number) {
    throw new NotFoundException(`Vaccine with id ${id} not found`);
  }
}
