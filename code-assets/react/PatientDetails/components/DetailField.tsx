import React from 'react';

export interface DetailFieldProps {
  fieldName: string;
  fieldValue: string;
}

const DetailField: React.FC<DetailFieldProps> = ({ fieldName, fieldValue }) => {
  return (
    <div className={'mr-4 min-h-5 mb-2'}>
      <span className='text-2xs font-barlow text-grey-greyscale font-medium'>
        {fieldName + ': '}
      </span>
      <span className='font-barlow text-2xs text-black-main font-medium'>{fieldValue}</span>
    </div>
  );
};

export default DetailField;
