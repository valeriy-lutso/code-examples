import React, { useEffect, useState } from 'react';
import PageHeader from 'src/ui/PageHeader/PageHeader';

import SearchInput from 'src/ui/common/SearchInput/SearchInput';
import VaccineCard from 'src/ui/common/VaccineCard/VaccineCard';
import Button from 'src/ui/common/Button/Button';
import slide1 from '../../assets/container-slide-1.png';
import { useTranslation } from 'react-i18next';
import {
  dispatchAddVaccineInit,
  dispatchAddVaccineRequest,
  dispatchDeleteVaccineRequest,
  dispatchEditVaccineRequest,
  getVaccineDetailsRequest,
  dispatchSetVaccineSearchQuery,
  dispatchShowMoreVaccines,
  dispatchVaccinesRequest,
  closeVaccineModalPanel,
} from 'src/store/slices/vaccines/vaccines.action';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import ModalPanel from './components/ModalPanel';
import VaccineForm from './components/VaccineForm';
import { VaccineFormData } from 'src/store/slices/vaccines/vaccines.types';
import VaccineDetails from './components/VaccineDetails';
import Modal from 'src/ui/common/Modal/Modal';

const VaccinesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [onDeleteVaccineId, setOnDeleteVaccineId] = useState<number>(0);

  const {
    vaccines,
    totalRecords,
    limit,
    moreAmount,
    panelStatus,
    openVaccineDetails,
    searchQuery,
    pending,
  } = useAppSelector(state => state.vaccines);

  let cardContainerLayout = 'w-full grid grid-cols-cards gap-y-4 place-content-start gap-x-8';

  useEffect(() => {
    dispatch(dispatchVaccinesRequest());
  }, []);

  if (vaccines.length == 0) {
    cardContainerLayout = 'flex justify-center';
  }

  const onSave = (values: VaccineFormData) => {
    dispatch(
      dispatchAddVaccineRequest({
        formData: values,
      }),
    );
  };

  const onSaveEdit = (values: VaccineFormData) => {
    dispatch(
      dispatchEditVaccineRequest({
        formData: values,
        vaccineId: openVaccineDetails.id,
      }),
    );
  };

  const openDeleteModal = (vaccineId: number) => {
    setOnDeleteVaccineId(vaccineId);
    setIsOpenDeleteModal(true);
  };

  const onDelete = (vaccineId: number) => {
    dispatch(dispatchDeleteVaccineRequest(vaccineId));
    setIsOpenDeleteModal(false);
  };

  const getPanelHeading = () => {
    return panelStatus === 'add'
      ? t('vaccinePage.panel.titleAdd')
      : t('vaccinePage.panel.titleView');
  };

  return (
    <>
      <PageHeader>
        <SearchInput
          placeholder={t('vaccinePage.searchPlaceholder')}
          onChange={(value: string) => {
            dispatch(dispatchSetVaccineSearchQuery(value));
          }}
          value={searchQuery}
        />
      </PageHeader>
      <main className='px-9 py-4 border-t'>
        <div className='flex justify-between items-baseline py-4'>
          <h4>{t('vaccinePage.title')}</h4>
          <div className='flex basis-8/12 justify-end'>
            <Button
              label={t('vaccinePage.addVaccineBtn')}
              isDisabled={false}
              type={'outlined'}
              name={'add-vaccine'}
              onClick={() => dispatch(dispatchAddVaccineInit())}
              id={'add-vaccine'}
              sizeValue={'max-w-48.75'}
              size={''}
            />
            <div className='ml-4'>
              <Button
                label={t('vaccinePage.pdfButton')}
                isDisabled={false}
                size={'small'}
                type={'text'}
                name={'download-pdf-vaccine'}
                onClick={undefined}
                id={'download-pdf-vaccine'}
              />
            </div>
          </div>
        </div>
        <div className={cardContainerLayout}>
          {vaccines.map(vaccine => {
            return (
              <VaccineCard
                key={'vaccine' + vaccine.id}
                {...{
                  name: vaccine.name,
                  age: vaccine.age,
                  series: vaccine.series,
                  dose: vaccine.dose,
                  date: vaccine.date,
                  viewAction: () =>
                    dispatch(getVaccineDetailsRequest({ vaccineId: vaccine.id, edit: false })),
                  editAction: () =>
                    dispatch(getVaccineDetailsRequest({ vaccineId: vaccine.id, edit: true })),
                  deleteAction: () => openDeleteModal(vaccine.id),
                }}
              />
            );
          })}
          {vaccines.length == 0 && searchQuery.trim().length === 0 && !pending ? (
            <div className='max-w-107'>
              <img src={slide1} />
              <p className='mt-4 mb-8 text-center'>{t('vaccinePage.noVaccinesMessage')}</p>
              <Button
                label={t('vaccinePage.addVaccinesBtn')}
                isDisabled={false}
                type={'filled'}
                id={'add-vaccines-filles-btn'}
                name={'add-vaccines-filles-btn'}
                onClick={() => dispatch(dispatchAddVaccineInit())}
                size={''}
              />
            </div>
          ) : null}
        </div>

        {totalRecords > limit && (
          <Button
            label={t('general.showMore')}
            onClick={() => dispatch(dispatchShowMoreVaccines(limit + moreAmount))}
            type={'button'}
            name={'show-more-vaccines'}
            size={'small'}
            isDisabled={false}
            id={'show-more-vaccines'}
          />
        )}
      </main>
      <ModalPanel isOpen={panelStatus == 'none' ? false : true} title={getPanelHeading()}>
        {panelStatus == 'add' ? (
          <VaccineForm
            saveAction={onSave}
            cancelAction={() => {
              return dispatch(closeVaccineModalPanel());
            }}
          />
        ) : panelStatus == 'view' ? (
          <VaccineDetails
            data={openVaccineDetails}
            backAction={() => {
              return dispatch(closeVaccineModalPanel());
            }}
            editAction={() =>
              dispatch(getVaccineDetailsRequest({ vaccineId: openVaccineDetails.id, edit: true }))
            }
            deleteAction={() => openDeleteModal(openVaccineDetails.id)}
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
        isOpen={isOpenDeleteModal}
        onClose={() => setIsOpenDeleteModal(false)}
        title={t('vaccinePage.deleteConfirm')}
        onConfirm={() => onDelete(onDeleteVaccineId)}
        closeLabel={t('general.cancel')}
        confirmLabel={t('general.delete')}
        additionalStyle='z-20'
      />
    </>
  );
};

export default VaccinesPage;
