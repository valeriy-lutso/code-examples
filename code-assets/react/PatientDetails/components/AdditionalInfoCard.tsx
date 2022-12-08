import React from 'react';
import { RelationType } from 'src/shared';
import { ContactPersonRelationType } from 'src/shared/contact-person';
import person from 'src/icons/person.svg';
import Button from 'src/ui/common/Button/Button';
import { useTranslation } from 'react-i18next';

export interface AdditionalInfoCardProps {
  relatives: RelatedPersonListItemProps[];
  contact_people: RelatedPersonListItemProps[];
}

const AdditionalInfoCard: React.FC<AdditionalInfoCardProps> = ({ relatives, contact_people }) => {
  const { t } = useTranslation();
  return (
    <div className={'rounded-lg bg-chosen font-barlow p-4 mt-4'}>
      <h4 className='text-2lg text-black-main font-bold'>{t('patientDetails.sidebar.addInfo')}</h4>
      <section className='mt-4'>
        <h5 className='text-lg font-semibold mb-1'>{t('patientDetails.sidebar.relatives')}</h5>
        <ul>
          {relatives.map(relative => (
            <RelatedPersonListItem {...relative} key={'relative' + relative.id} />
          ))}
        </ul>
        <Button
          label={t('myPatients.showMore')}
          isDisabled={false}
          size={''}
          type={'text'}
          name={''}
          onClick={undefined}
        />
      </section>
      <section className='mt-4'>
        <h5 className='text-lg font-semibold mb-1'>{t('patientDetails.sidebar.contactPerson')}</h5>
        <ul>
          {contact_people.map(contact => (
            <RelatedPersonListItem {...contact} key={'contact' + contact.id} />
          ))}
        </ul>
        <Button
          label={t('myPatients.showMore')}
          isDisabled={false}
          size={''}
          type={'text'}
          name={''}
          onClick={undefined}
        />
      </section>
    </div>
  );
};

export default AdditionalInfoCard;

interface RelatedPersonListItemProps {
  first_name: string;
  last_name: string;
  relation_type: RelationType | ContactPersonRelationType;
  id?: number;
}

const RelatedPersonListItem: React.FC<RelatedPersonListItemProps> = ({
  first_name,
  last_name,
  relation_type,
}) => {
  return (
    <li className='flex items-center hover:bg-[#CCD8E0] rounded-lg text-black-main font-medium font-barlow text-2xs'>
      <img src={person} className='mx-1 my-2' />
      <div>{`${first_name} ${last_name}, ${relation_type}`}</div>
    </li>
  );
};
