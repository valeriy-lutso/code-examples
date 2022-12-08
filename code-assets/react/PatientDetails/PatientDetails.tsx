import React, { useEffect, useState } from 'react';
import PageHeader from 'src/ui/PageHeader/PageHeader';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import Button from 'src/ui/common/Button/Button';
import ArrowButton from 'src/ui/common/ArrowButton';
import { dispatchPatientDetailsRequest } from 'src/store/slices/patient-details/patient-details.action';
import VaccineListItem from './components/VaccineListItem';
import VisitListItem from './components/VisitListItem';
import AdditionalInfoCard from './components/AdditionalInfoCard';
import { useNavigate, useParams } from 'react-router-dom';
import { CHAT_ROUTE, MY_PATIENTS_ROUTE } from 'src/config';
import { dispatchSetPatientStatusRequest } from 'src/store/slices/my-patients/patients.action';
import { DeclarationStatus } from 'src/shared/declaration';
import Modal from 'src/ui/common/Modal';
import DropdownSection from './components/DropdownSection';
import MedicalInfoSection from './components/MedicalInfoSection';
import BMISection from './components/BMISection';
import GeneralInfoSection from './components/GeneralInfoSection';
import { useTranslation } from 'react-i18next';
import VaccineDetails from '../VaccinesPage/components/VaccineDetails';
import ModalPanel from '../VaccinesPage/components/ModalPanel';
import VaccineForm from '../VaccinesPage/components/VaccineForm';
import { VaccineFormData } from 'src/store/slices/vaccines/vaccines.types';
import {
  dispatchEditVaccineRequest,
  dispatchDeleteVaccineRequest,
  getVaccineDetailsRequest,
  closeVaccineModalPanel,
} from 'src/store/slices/vaccines/vaccines.action';

interface Props {
  data?: string;
}

const PatientDetails: React.FC<Props> = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { patientId } = useParams();

  const [isOpenTerminateModal, setIsOpenTerminateModal] = useState<boolean>(false);
  const [isOpenDeleteVaccineModal, setIsOpenDeleteVaccineModal] = useState<boolean>(false);
  const [onDeleteVaccineId, setOnDeleteVaccineId] = useState<number>(0);

  useEffect(() => {
    dispatch(dispatchPatientDetailsRequest(Number(patientId)));
  }, []);

  const { patientDetails, panelStatus, openVaccineDetails } = useAppSelector(
    state => state.patientDetails,
  );

  const onTerminate = (declarationId: number) => {
    dispatch(dispatchSetPatientStatusRequest(DeclarationStatus.Terminated, declarationId));
    setIsOpenTerminateModal(false);
  };

  const openTerminateModal = () => {
    setIsOpenTerminateModal(true);
  };

  const onSaveEdit = (values: VaccineFormData) => {
    dispatch(
      dispatchEditVaccineRequest({
        formData: values,
        vaccineId: openVaccineDetails.id,
      }),
    );
  };

  const openDeleteVaccineModal = (vaccineId: number) => {
    setOnDeleteVaccineId(vaccineId);
    setIsOpenDeleteVaccineModal(true);
  };

  const onDelete = (vaccineId: number) => {
    dispatch(dispatchDeleteVaccineRequest(vaccineId));
    setIsOpenDeleteVaccineModal(false);
  };

  const { t } = useTranslation();

  return (
    <div className='w-full'>
      <PageHeader></PageHeader>
      <div className='flex'>
        <main className='px-9 py-4 basis-3/4 border-r'>
          {patientDetails.address != undefined ? (
            <>
              <div className='flex'>
                <div className='relative top-1'>
                  <ArrowButton
                    direction={'left'}
                    arrowColor={'grey'}
                    isClicked={false}
                    onClick={() => navigate(MY_PATIENTS_ROUTE)}
                  />
                </div>
                <h4>{t('myPatients.title')}</h4>
              </div>
              <section className='grid grid-cols-[auto_1fr] mt-4'>
                <GeneralInfoSection
                  personalInfo={patientDetails.personalInfo}
                  insurancePolicy={patientDetails.insurancePolicy}
                  address={patientDetails.address}
                />

                <section className='col-start-2 mt-4'>
                  <BMISection {...patientDetails.bmiParameters[0]} />
                </section>

                <section className='col-start-2 mt-4'>
                  <MedicalInfoSection {...patientDetails.medicalInfo} />
                </section>

                <div className='col-start-2 mt-4'>
                  <DropdownSection heading={t('patientDetails.vaccineDetails')}>
                    <ul>
                      {patientDetails.vaccines.map(vaccine => (
                        <VaccineListItem
                          {...vaccine}
                          fieldTitles={{
                            date: t('patientDetails.vaccine.date'),
                            drug: t('patientDetails.vaccine.drug'),
                            series: t('patientDetails.vaccine.series'),
                            dose: t('patientDetails.vaccine.dose'),
                          }}
                          key={'vaccine' + vaccine.id}
                          onClick={() =>
                            dispatch(
                              getVaccineDetailsRequest({ vaccineId: vaccine.id, edit: false }),
                            )
                          }
                        />
                      ))}
                    </ul>
                  </DropdownSection>
                </div>

                <div className='col-start-2 mt-4'>
                  <DropdownSection heading={t('patientDetails.healthHistory')}>
                    <p className='text-sm font-medium mt-2 mb-3'>
                      {t('patientDetails.healthHistorySubtitle')}
                    </p>
                    <ul className='inline'>
                      {patientDetails.visits.map(visit => (
                        <VisitListItem {...visit} key={'visit' + visit.id} />
                      ))}
                    </ul>
                  </DropdownSection>
                </div>

                <footer className='col-start-2 mt-4 mb-10'>
                  <div className='flex mt-4 justify-between'>
                    {patientDetails.declarations[0].status == DeclarationStatus.Accepted ? (
                      <div className='basis-1/2 mr-4'>
                        <Button
                          label={t('myPatients.card.terminate')}
                          isDisabled={false}
                          size=''
                          type={'outlined'}
                          name={''}
                          onClick={() => openTerminateModal()}
                        />
                      </div>
                    ) : null}
                    <div className='basis-1/2 ml-4'>
                      <Button
                        label={t('myPatients.card.openChat')}
                        isDisabled={false}
                        size={
                          patientDetails.declarations[0].status == DeclarationStatus.Accepted
                            ? ''
                            : 'large'
                        }
                        type={'filled'}
                        name={''}
                        onClick={() => navigate(CHAT_ROUTE)}
                      />
                    </div>
                  </div>
                </footer>
              </section>
            </>
          ) : null}
        </main>
        <div className='pr-10 pl-9 basis-1/3'>
          {patientDetails.address != undefined ? (
            <AdditionalInfoCard
              relatives={patientDetails.relatives}
              contact_people={patientDetails.contactPeople}
            />
          ) : null}
        </div>
      </div>

      <ModalPanel isOpen={panelStatus == 'none' ? false : true} title={'Vaccine details'}>
        {panelStatus == 'view' ? (
          <VaccineDetails
            data={openVaccineDetails}
            backAction={() => {
              return dispatch(closeVaccineModalPanel());
            }}
            editAction={() =>
              dispatch(getVaccineDetailsRequest({ vaccineId: openVaccineDetails.id, edit: true }))
            }
            deleteAction={() => openDeleteVaccineModal(openVaccineDetails.id)}
          />
        ) : panelStatus == 'edit' ? (
          <VaccineForm
            saveAction={onSaveEdit}
            cancelAction={() => {
              return dispatch(closeVaccineModalPanel());
            }}
            initialValues={openVaccineDetails}
          />
        ) : null}
      </ModalPanel>

      <Modal
        isOpen={isOpenDeleteVaccineModal}
        onClose={() => setIsOpenDeleteVaccineModal(false)}
        title={t('vaccinePage.deleteConfirm')}
        onConfirm={() => onDelete(onDeleteVaccineId)}
        closeLabel={t('general.cancel')}
        confirmLabel={t('general.delete')}
        additionalStyle='z-20'
      />

      <Modal
        isOpen={isOpenTerminateModal}
        onClose={() => setIsOpenTerminateModal(false)}
        title={t('patientDetails.terminateQuestion')}
        onConfirm={() => {
          onTerminate(patientDetails.declarations[0].id);
          navigate(MY_PATIENTS_ROUTE);
        }}
        closeLabel={t('patientDetails.cancel')}
        confirmLabel={t('myPatients.card.terminate')}
      />
    </div>
  );
};

export default PatientDetails;
