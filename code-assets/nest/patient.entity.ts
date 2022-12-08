import { Column, ForeignKey, Model, Table, BelongsTo, HasMany, HasOne } from 'sequelize-typescript';
import { InferAttributes, InferCreationAttributes } from 'sequelize/types';
import { User } from 'src/user/entities/user.entity';
import { MedicalInfo } from 'src/medical-info/entities/medical-info.entity';
import { ContactPerson } from 'src/contact-person/entities/contact-person.entity';
import { Bmi } from 'src/bmi/entities/bmi.entity';
import { Declaration } from 'src/declaration/entities/declaration.entity';
import { Relative } from 'src/relative/entities/relative.entity';
import { InsurancePolicy } from 'src/insurancePolicy/entities/insurancePolicy.entity';
import { Vaccine } from 'src/vaccine/entities/vaccine.entity';
import { Visit } from 'src/visit/entities/visit.entity';

@Table({ underscored: true, createdAt: false, updatedAt: false })
export class Patient extends Model<InferAttributes<Patient>, InferCreationAttributes<Patient>> {
  @ForeignKey(() => User)
  @Column({ primaryKey: true })
  public userId: number;

  @Column({ allowNull: false })
  public address: string;

  @Column({ allowNull: false, defaultValue: true })
  getUpcomingVisitsReminders: boolean;

  @Column({ allowNull: false, defaultValue: true })
  getDeclarationTerminationProposals: boolean;

  @Column({ allowNull: false, defaultValue: true })
  getRecommendations: boolean;

  @Column({ allowNull: false, defaultValue: true })
  getFillDataReminders: boolean;

  @BelongsTo(() => User, { onDelete: 'CASCADE' })
  public user: User;

  @HasOne(() => MedicalInfo)
  public medicalInfo?: MedicalInfo;

  @HasMany(() => ContactPerson)
  public contactPeople: ContactPerson[];

  @HasMany(() => Bmi)
  public bmiParameters: Bmi[];

  @HasMany(() => Relative)
  public relatives: Relative[];

  @HasOne(() => InsurancePolicy)
  public insurancePolicy: InsurancePolicy;

  @HasMany(() => Vaccine)
  public vaccines: Vaccine[];

  @HasMany(() => Visit)
  public visits: Visit[];

  @HasMany(() => Declaration)
  public declarations: Declaration[];
}
