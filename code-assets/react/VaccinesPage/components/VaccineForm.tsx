import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { VaccineSchema } from 'src/pages/PatientsQuestionnairePage/validationSchemas';
import { VaccineFormData } from 'src/store/slices/vaccines/vaccines.types';
import Button from 'src/ui/common/Button/Button';
import DateOfBirthInput from 'src/ui/common/DateOfBirthInput';
import FieldsContainer from 'src/ui/common/FieldsContainer';
import TextInput from 'src/ui/common/TextInput';

interface VaccineFormProps {
  cancelAction: React.MouseEventHandler;
  saveAction: any;
  initialValues?: VaccineFormData;
}

const VaccineForm: React.FC<VaccineFormProps> = ({
  cancelAction,
  saveAction,
  initialValues = {
    name: '',
    date: '',
    age: '',
    dose: '',
    series: '',
    reaction: '',
    description: '',
  },
}) => {
  const { t } = useTranslation();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={saveAction}
      validationSchema={VaccineSchema}
      validateOnMount
    >
      {({ isSubmitting, isValid }) => (
        <Form className='w-full'>
          <FieldsContainer className='w-full'>
            <Field
              component={TextInput}
              placeholder={t('vaccinePage.panel.fields.enterDrugName')}
              label={t('vaccinePage.card.drugName')}
              name={'name'}
              id={'drug-name'}
            />
            <Field
              component={DateOfBirthInput}
              label={t('vaccinePage.card.dateReceived')}
              name={'date'}
              id={'date-received'}
            />
            <Field
              component={TextInput}
              name={'age'}
              label={t('vaccinePage.panel.fields.yourAge')}
              placeholder={t('vaccinePage.panel.fields.yourAge')}
              id={'age'}
              type={'number'}
            />
            <Field
              component={TextInput}
              name='dose'
              label={t('vaccinePage.card.dose')}
              placeholder={t('vaccinePage.card.dose')}
              id='dose'
              type='number'
            />
            <Field
              component={TextInput}
              name='series'
              label={t('vaccinePage.card.series')}
              placeholder={t('vaccinePage.panel.fields.seriesName')}
              id='series'
            />
            <Field
              component={TextInput}
              name='reaction'
              label={t('vaccinePage.panel.fields.reactionLabel')}
              placeholder={t('vaccinePage.panel.fields.reactionPlaceholder')}
              id='reaction'
            />
            <Field
              component={TextInput}
              name='description'
              label={t('vaccinePage.panel.fields.medicalContradictions')}
              placeholder={t('vaccinePage.panel.fields.medicalContradictions')}
              id='decription'
            />
          </FieldsContainer>
          <div className='mt-24 flex justify-end pb-8'>
            <Button
              buttonType='button'
              id='cancel-vaccine-form'
              label={t('general.cancel')}
              isDisabled={false}
              name='cancel-vaccine-form'
              onClick={cancelAction}
              size='small'
              type='outlined'
            />
            <Button
              buttonType='submit'
              id='save-vaccine-form'
              label={t('general.saveLabel')}
              isDisabled={isSubmitting || !isValid}
              name='save-vaccine-form'
              onClick={() => undefined}
              size='small'
              type='filled'
              className='ml-4'
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default VaccineForm;
