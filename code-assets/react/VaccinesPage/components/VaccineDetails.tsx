import React from 'react';
import { useTranslation } from 'react-i18next';
import { VaccineData } from 'src/store/slices/vaccines/vaccines.types';
import Button from 'src/ui/common/Button/Button';
import CardField from 'src/ui/common/UserCard/components/CardField';

interface VaccineDetailsProps {
  data: VaccineData;
  backAction: React.MouseEventHandler;
  editAction: React.MouseEventHandler;
  deleteAction: React.MouseEventHandler;
}

const VaccineDetails: React.FC<VaccineDetailsProps> = ({
  data,
  backAction,
  editAction,
  deleteAction,
}) => {
  const { t } = useTranslation();

  return (
    <div className='w-full flex flex-col justify-between'>
      <div>
        <CardField fieldName={t('vaccinePage.card.drugName')} fieldValue={data.name} />
        <CardField fieldName={t('vaccinePage.card.dateReceived')} fieldValue={data.date} />
        <CardField
          fieldName={t('vaccinePage.panel.fields.yourAge')}
          fieldValue={String(data.age)}
        />
        <CardField fieldName={t('vaccinePage.card.dose')} fieldValue={String(data.dose)} />
        <CardField
          fieldName={t('vaccinePage.panel.fields.reactionLabel')}
          fieldValue={data.reaction}
        />
        <CardField
          fieldName={t('vaccinePage.panel.fields.medicalContradictions')}
          fieldValue={data.description}
        />
      </div>
      <div className='flex justify-between'>
        <Button
          buttonType='button'
          id='back-to-vaccines'
          label={t('general.backLabel')}
          name='back-to-vaccines'
          onClick={backAction}
          size=''
          type='text'
          isDisabled={false}
          className='basis-1'
        />
        <div className='flex justify-end basis-9/12'>
          <Button
            buttonType='button'
            id='delete-vaccine'
            label={t('general.delete')}
            isDisabled={false}
            name='delete-vaccine'
            onClick={deleteAction}
            size='small'
            type='outlined'
          />
          <Button
            buttonType='button'
            id='edit-vaccine'
            label={t('general.edit')}
            name='edit-vaccine'
            onClick={editAction}
            size='small'
            type='filled'
            className='ml-4'
            isDisabled={false}
          />
        </div>
      </div>
    </div>
  );
};

export default VaccineDetails;
