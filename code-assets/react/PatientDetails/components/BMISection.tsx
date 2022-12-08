import React from 'react';
import { useTranslation } from 'react-i18next';
import DetailField from './DetailField';

export interface BMIProps {
  height: number;
  weight: number;
}

const BMISection: React.FC<BMIProps> = ({ height, weight }) => {
  const { t } = useTranslation();
  return (
    <>
      <h5 className='text-lg font-semibold'>{t('patientDetails.bmi.title')}</h5>
      <div className='flex'>
        <div className='flex-1'>
          <DetailField fieldName={t('patientDetails.bmi.height')} fieldValue={String(height)} />
        </div>
        <div className='flex-1'>
          <DetailField fieldName={t('patientDetails.bmi.weight')} fieldValue={String(weight)} />
        </div>
      </div>
    </>
  );
};

export default BMISection;
