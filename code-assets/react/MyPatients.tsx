import React, { useEffect, useState } from 'react';
import UserCardContainer from 'src/ui/common/UserCardContainer/UserCardContainer';
import PageHeader from 'src/ui/PageHeader/PageHeader';
import DropdownPanel from 'src/ui/common/DropdownPanel/DropdownPanel';
import TabButton from 'src/ui/common/TabButton/TabButton';
import { useAppDispatch, useAppSelector } from 'src/hooks';

import { DeclarationStatus } from 'src/shared/declaration';
import Modal from 'src/ui/common/Modal';
import { useNavigate } from 'react-router-dom';
import { CHAT_ROUTE, DECLARATIONS_ROUTE, MY_PATIENTS_ROUTE } from 'src/config';
import SearchInput from 'src/ui/common/SearchInput/SearchInput';
import Button from 'src/ui/common/Button/Button';
import {
  dispatchSetPatientStatusRequest,
  dispatchPatientsRequest,
  dispatchSetSearchQuery,
  dispatchSetSortBy,
  dispatchShowAccepted,
  dispatchShowMorePatients,
} from 'src/store/slices/my-patients/patients.action';
import { useTranslation } from 'react-i18next';
import slide1 from '../../assets/container-slide-1.png';
import { SortBy } from 'src/shared/my-patients/SortBy';

const MyPatients: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [isOpenTerminateModal, setIsOpenTerminateModal] = useState<boolean>(false);
  const [onTerminateDeclarationId, setOnTerminateDeclarationId] = useState<number>(0);

  const { patients, showAccepted, searchQuery, limit, totalRecords, moreAmount, pending } =
    useAppSelector(state => state.myPatients);

  const onTerminate = (declarationId: number) => {
    dispatch(dispatchSetPatientStatusRequest(DeclarationStatus.Terminated, declarationId));
    setIsOpenTerminateModal(false);
  };

  const openTerminateModal = (declarationId: number) => {
    setOnTerminateDeclarationId(declarationId);
    setIsOpenTerminateModal(true);
  };

  useEffect(() => {
    dispatch(dispatchPatientsRequest());
  }, []);

  return (
    <div className='w-full mb-10'>
      <PageHeader>
        <SearchInput
          placeholder={t('myPatients.searchPlaceholder')}
          onChange={(value: string) => {
            dispatch(dispatchSetSearchQuery(value));
          }}
          value={searchQuery}
        />
      </PageHeader>
      <main className='px-9 py-4 border-t min-h-screen'>
        <div className='flex justify-between items-baseline py-4'>
          <h4>{t('myPatients.title')}</h4>
          <DropdownPanel
            onChange={(value: any) => {
              dispatch(dispatchSetSortBy(value));
              dispatch(dispatchPatientsRequest());
            }}
            options={[
              { full: SortBy.byDate, short: SortBy.byDate },
              { full: SortBy.byName, short: SortBy.byName },
            ]}
            title={'Sort by'}
            keepTitle={true}
          />
        </div>
        <div className='py-4 flex'>
          <TabButton
            active={showAccepted}
            title={t('myPatients.activeTab')}
            onClick={() => {
              dispatch(dispatchShowAccepted(true));
              dispatch(dispatchPatientsRequest());
            }}
          />
          <TabButton
            active={!showAccepted}
            title={t('myPatients.terminatedTab')}
            onClick={() => {
              dispatch(dispatchShowAccepted(false));
              dispatch(dispatchPatientsRequest());
            }}
          />
        </div>
        <UserCardContainer
          users={patients?.map(declaration => {
            return {
              name: declaration.patient.personalInfo.firstName,
              surname: declaration.patient.personalInfo.lastName,
              avatarUrl: declaration.patient.personalInfo.avatarImageUrl,
              fields: [
                {
                  fieldName: t('myPatients.card.phone'),
                  fieldValue: declaration.patient.personalInfo.phone,
                },
                {
                  fieldName: t('myPatients.card.address'),
                  fieldValue: declaration.patient.address,
                },
              ],
              footerProps: {
                filledButtonTitle: t('myPatients.card.openChat'),
                userId: declaration.id,
                outlinedButtonTitle: showAccepted ? t('myPatients.card.terminate') : undefined,
                filledButtonAction: () => navigate(CHAT_ROUTE),
                textButtonAction: () =>
                  navigate(MY_PATIENTS_ROUTE + '/' + declaration.patient.userId),
                outlinedButtonAction: () => openTerminateModal(declaration.id),
                textButtonTitle: t('myPatients.card.viewDetails'),
              },
            };
          })}
        />

        {patients.length == 0 && searchQuery.trim().length === 0 && !pending ? (
          <div className='max-w-107 m-auto'>
            <img src={slide1} />
            <p className='mt-4 mb-8 text-center'>
              {t(
                showAccepted
                  ? 'myPatients.noPatientsMessageActive'
                  : 'myPatients.noPatientsMessageTerminated',
              )}
            </p>
            <Button
              label={t(
                showAccepted
                  ? 'myPatients.noPatientsActiveButton'
                  : 'myPatients.noPatientsTerminatedButton',
              )}
              isDisabled={false}
              type={'filled'}
              id={'add-vaccines-filles-btn'}
              name={'add-vaccines-filles-btn'}
              onClick={
                showAccepted
                  ? () => navigate(DECLARATIONS_ROUTE)
                  : () => {
                      dispatch(dispatchShowAccepted(true));
                      dispatch(dispatchPatientsRequest());
                    }
              }
              size={''}
            />
          </div>
        ) : null}
      </main>

      <Modal
        isOpen={isOpenTerminateModal}
        onClose={() => setIsOpenTerminateModal(false)}
        title={t('patientDetails.terminateQuestion')}
        onConfirm={() => onTerminate(onTerminateDeclarationId)}
        closeLabel={t('patientDetails.cancel')}
        confirmLabel={t('myPatients.card.terminate')}
      />

      {totalRecords > limit && (
        <Button
          label={t('myPatients.showMore')}
          onClick={() => dispatch(dispatchShowMorePatients(limit + moreAmount))}
          type={'button'}
          name={'showMore'}
          size={'small'}
          isDisabled={false}
          id={'my-patients-pagination-btn'}
        />
      )}
    </div>
  );
};

export default MyPatients;
