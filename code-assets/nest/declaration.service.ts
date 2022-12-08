import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Declaration } from './entities';
import { CreateDeclarationDto, UpdateDeclarationDto } from './dto';
import { FamilyPractitioner, FamilyPractitionerService } from '../familyPractitioner';
import { DeclarationStatus } from '../shared/declaration';
import { Patient } from '../patient';
import { Role } from '../shared/role';
import { PersonalInfo } from 'src/personal-info/entities/personal-info.entity';
import { Op } from 'sequelize';
import { SortBy } from 'src/shared/my-patients/SortBy';
import { User } from 'src/user';

@Injectable()
export class DeclarationService {
  constructor(
    @InjectModel(Declaration) private declarationRepository: typeof Declaration,
    @Inject(forwardRef(() => FamilyPractitionerService))
    private readonly familyPractitionerService: FamilyPractitionerService,
  ) {}

  async create(createDeclarationDto: CreateDeclarationDto, patientUserId: number) {
    await this.familyPractitionerService.findOne(createDeclarationDto.practitionerId);

    return this.declarationRepository.create({
      practitioner_id: createDeclarationDto.practitionerId,
      patient_id: patientUserId,
      sign_date: null,
    });
  }

  async update(id: number, updateDeclarationDto: UpdateDeclarationDto) {
    const declaration = await this.declarationRepository.findByPk(id);

    if (declaration === null) {
      throw new NotFoundException('Declaration not found');
    }

    if (updateDeclarationDto.status === DeclarationStatus.Accepted) {
      declaration.sign_date = new Date().toLocaleDateString();
    }

    declaration.status = updateDeclarationDto.status;
    await declaration.save();

    return declaration;
  }

  async findAll() {
    const declaraions = await this.declarationRepository.findAll({ include: { all: true } });
    return declaraions;
  }

  async findOne(id: number) {
    const declaration = await this.declarationRepository.findByPk(id);

    if (declaration === null) {
      throw new NotFoundException('Declaration not found');
    }

    return declaration;
  }

  async findByPatientId(patient_id: number): Promise<Declaration> {
    return await this.declarationRepository.findOne({
      where: { patient_id },
    });
  }

  async findByUserId(userId: number) {
    return await this.declarationRepository.findAll({
      where: {
        patient_id: userId,
      },
    });
  }

  async findByUser(
    role: Role,
    userId: number,
    filter = '',
    sort = '',
    status: DeclarationStatus = DeclarationStatus.Expects,
    limit = 10,
  ) {
    const totalRecords = await this.declarationRepository.count({ where: { status: status } });

    const declarations = await this.declarationRepository.findAll({
      attributes: ['id', 'sign_date', 'status', 'createdAt'],
      limit: limit,
      where: { status },
      include: [
        {
          required: true,
          attributes: ['userId'],
          model: role === Role.patient ? Patient : FamilyPractitioner,
          where: {
            userId,
          },
        },
        {
          required: true,
          attributes: ['userId', role === Role.patient ? 'about' : 'address'],
          model: role === Role.patient ? FamilyPractitioner : Patient,
          include: [
            {
              model: User,
              include: [
                {
                  required: true,
                  model: PersonalInfo,
                  where: {
                    [Op.or]: {
                      firstName: { [Op.iLike]: '%' + filter + '%' },
                      lastName: { [Op.iLike]: '%' + filter + '%' },
                    },
                  },
                  order: sort === 'name' ? [['firstName', 'DESC']] : undefined,
                },
              ],
            },
          ],
        },
      ],
      order: sort === 'date' ? [['createdAt', 'DESC']] : undefined,
    });

    const mappedDeclarations = declarations.map(declarationInstance => {
      const { patient, practitioner, ...declarationAttributes } = declarationInstance.toJSON();

      let mappedPatient: any = patient;
      let mappedPractitioner: any = practitioner;

      if (role === Role.patient) {
        mappedPractitioner = {
          about: practitioner.about,
          personalInfo: practitioner.user.personalInfo,
        };
      } else {
        mappedPatient = {
          address: patient.address,
          personalInfo: patient.user.personalInfo,
        };
      }

      return { practitioner: mappedPractitioner, patient: mappedPatient, ...declarationAttributes };
    });

    return { declarations: mappedDeclarations, totalRecords };
  }

  async remove(id: number) {
    const declaration = await this.declarationRepository.findByPk(id);

    if (declaration === null) {
      throw new NotFoundException('Declaration not found');
    }
    await this.declarationRepository.destroy({ where: { id } });

    return declaration;
  }

  async findMyPatients(
    familyPractitionerUserId: number,
    status: string,
    sort: string,
    search: string,
    limit: number,
  ) {
    console.log(sort);
    let sortParams = [];
    sortParams = [['sign_date', 'DESC']];

    if (sort == SortBy.byName) {
      sortParams = [
        [
          { model: Patient, as: 'patient' },
          { model: PersonalInfo, as: 'personalInfo' },
          'first_name',
          'ASC',
        ],
      ];
    }

    const myPatients = await this.declarationRepository.findAndCountAll({
      where: {
        practitioner_id: familyPractitionerUserId,
        status: status,
        [Op.or]: {
          '$patient.address$': { [Op.iLike]: '%' + search + '%' },
          '$patient.user.personalInfo.first_name$': { [Op.iLike]: '%' + search + '%' },
          '$patient.user.personalInfo.last_name$': { [Op.iLike]: '%' + search + '%' },
        },
      },
      attributes: ['id', 'status', 'sign_date', 'practitioner_id'],
      limit: limit,
      order: sortParams,
      include: [
        {
          model: Patient,
          as: 'patient',
          attributes: ['address', 'userId'],
          include: [
            {
              model: User,
              include: [
                {
                  model: PersonalInfo,
                  as: 'personalInfo',
                  attributes: ['firstName', 'lastName', 'phone', 'avatarImageUrl'],
                },
              ],
            },
          ],
        },
      ],
    });

    const mappedPatients = myPatients.rows.map(patientInstance => {
      const { patient, ...declarationAttributes } = patientInstance.toJSON();
      const { user, ...patientAttributes } = patient;

      return {
        ...declarationAttributes,
        patient: {
          ...patientAttributes,
          personalInfo: user.personalInfo,
        },
      };
    });

    return { patients: mappedPatients, totalRecords: myPatients.count };
  }
}
