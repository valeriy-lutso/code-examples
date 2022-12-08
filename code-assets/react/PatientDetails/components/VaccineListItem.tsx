import React from 'react';
import { useTranslation } from 'react-i18next';
import DetailField from './DetailField';

interface VaccineProps {
  id: number;
  name: string;
  description: string;
  date: string;
  series: string;
  reaction: string;
  dose: number;
  fieldTitles: {
    date: string;
    drug: string;
    series: string;
    dose: string;
  };
  onClick?: React.MouseEventHandler;
}

const VaccineListItem: React.FC<VaccineProps> = ({
  id,
  name,
  date,
  series,
  dose,
  fieldTitles,
  onClick,
}) => {
  const { t } = useTranslation();
  return (
    <li
      onClick={onClick}
      className='py-1 flex rounded hover:bg-chosen cursor-pointer'
      key={'vaccine' + id}
    >
      <div className='flex-1'>
        <DetailField fieldName={fieldTitles.date} fieldValue={formatDate(date)} />
      </div>
      <div className='flex-1'>
        <DetailField fieldName={fieldTitles.drug} fieldValue={name} />
      </div>
      <div className='flex-1'>
        <DetailField fieldName={fieldTitles.series} fieldValue={series} />
      </div>
      <div className='flex-1'>
        <DetailField fieldName={fieldTitles.dose} fieldValue={String(dose)} />
      </div>
    </li>
  );
};

export default VaccineListItem;

export function formatDate(stringDate: string) {
  const date = new Date(stringDate);
  return date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
}
