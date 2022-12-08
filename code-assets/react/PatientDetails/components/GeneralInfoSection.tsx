import React from 'react';
import { useTranslation } from 'react-i18next';
import { Gender } from 'src/shared';
import CardAvatar from 'src/ui/common/UserCard/components/CardAvatar';
import DetailField from './DetailField';

export interface GeneralInfoProps {
  personalInfo: {
    firstName: string;
    lastName: string;
    gender: Gender;
    phone: string;
    avatarImageUrl: string;
  };
  insurancePolicy: {
    id: 1;
    number: number;
    company_name: string;
    program_name: string;
  };
  address: string;
}

const GeneralInfoSection: React.FC<GeneralInfoProps> = ({
  personalInfo,
  address,
  insurancePolicy,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <div className='mr-4 inline-block w-fit'>
        <CardAvatar size='avatar-2' url={personalInfo.avatarImageUrl} />
      </div>
      <div>
        <div className='text-md font-semibold'>
          {personalInfo.firstName + ' ' + personalInfo.lastName}
        </div>
        <div className='flex'>
          <div className='flex-1'>
            <DetailField
              fieldName={t('patientDetails.general.phone')}
              fieldValue={personalInfo.phone}
            />
            <DetailField
              fieldName={t('patientDetails.general.insurance')}
              fieldValue={insurancePolicy.program_name}
            />
          </div>
          <div className='flex-1'>
            <DetailField fieldName={t('patientDetails.general.address')} fieldValue={address} />
            <DetailField
              fieldName={t('patientDetails.general.gender')}
              fieldValue={personalInfo.gender}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default GeneralInfoSection;
