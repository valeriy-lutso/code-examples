import { t } from 'i18next';
import React from 'react';
import { VisitStatus } from 'src/shared';
import DetailField from './DetailField';
import { formatDate } from './VaccineListItem';

interface VisitProps {
  id: number;
  time_range: string;
  is_online: true;
  status: VisitStatus;
  visit_report: {
    id: number;
    complaint: string;
    conclusion: string;
    recommendation: string;
    fileUrl: string;
  };
}

const VisitListItem: React.FC<VisitProps> = ({ id, time_range, visit_report }) => {
  return (
    <li className='pl-4 flex py-1 rounded hover:bg-chosen cursor-pointer' key={'visit' + id}>
      <div className='flex-1'>
        <DetailField
          fieldName={t('patientDetails.visit.date')}
          fieldValue={formatDate(time_range)}
        />
      </div>
      <div className='flex-1'>
        <DetailField
          fieldName={t('patientDetails.visit.reason')}
          fieldValue={visit_report.complaint}
        />
      </div>
      <div className='basis-2/4'>
        <DetailField
          fieldName={t('patientDetails.visit.treatment')}
          fieldValue={visit_report.recommendation}
        />
      </div>
    </li>
  );
};

export default VisitListItem;
