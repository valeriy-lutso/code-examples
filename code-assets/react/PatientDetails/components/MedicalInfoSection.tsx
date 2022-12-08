import { t } from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  BloodTypes,
  AsthmaOptions,
  DiabetesOptions,
  ViralHepatitisOptions,
  HIVAIDSOptions,
} from 'src/shared/medical-info/medical-info.options';
import DetailField from './DetailField';

export interface MedicalInfoProps {
  id: number;
  injuries: string;
  allergies: string;
  cardiovascular_diseases: string;
  drug_intolerance: string;
  blood_type: BloodTypes;
  asthma_status: AsthmaOptions;
  diabetes_status: DiabetesOptions;
  hepatitis_status: ViralHepatitisOptions;
  HIVAIDS_status: HIVAIDSOptions;
}

const MedicalInfoSection: React.FC<MedicalInfoProps> = ({
  injuries,
  allergies,
  cardiovascular_diseases,
  drug_intolerance,
  blood_type,
  asthma_status,
  diabetes_status,
  hepatitis_status,
  HIVAIDS_status,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <h5 className='text-lg font-semibold'>Medical info</h5>
      <div className='flex'>
        <div className='flex-1'>
          <DetailField fieldName={t('patientDetails.medicalInfo.blood')} fieldValue={blood_type} />
          <DetailField
            fieldName={t('patientDetails.medicalInfo.asthma')}
            fieldValue={asthma_status}
          />
          <DetailField
            fieldName={t('patientDetails.medicalInfo.allergies')}
            fieldValue={allergies}
          />
          <DetailField
            fieldName={t('patientDetails.medicalInfo.drugIntolerance')}
            fieldValue={drug_intolerance}
          />
          <DetailField
            fieldName={t('patientDetails.medicalInfo.hepatitis')}
            fieldValue={hepatitis_status}
          />
        </div>
        <div className='flex-1'>
          <DetailField fieldName={t('patientDetails.medicalInfo.injuries')} fieldValue={injuries} />
          <DetailField
            fieldName={t('patientDetails.medicalInfo.cardio')}
            fieldValue={cardiovascular_diseases}
          />
          <DetailField
            fieldName={t('patientDetails.medicalInfo.diabetes')}
            fieldValue={diabetes_status}
          />
          <DetailField
            fieldName={t('patientDetails.medicalInfo.HIV')}
            fieldValue={HIVAIDS_status}
          />
        </div>
      </div>
    </>
  );
};

export default MedicalInfoSection;
