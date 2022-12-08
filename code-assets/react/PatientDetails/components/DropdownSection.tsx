import React, { useState } from 'react';
import ArrowButton from 'src/ui/common/ArrowButton';

export interface DropdownSectionProps {
  heading: string;
}

const DropdownSection: React.FC<DropdownSectionProps> = ({ heading, children }) => {
  const [isDropped, setIsDropped] = useState<boolean>(false);
  return (
    <section>
      <div className='flex relative'>
        <div className='absolute -left-8'>
          <ArrowButton
            direction={isDropped ? 'down' : 'right'}
            arrowColor={'main'}
            isClicked={false}
            onClick={() => setIsDropped(!isDropped)}
          />
        </div>
        <h5 className='text-lg font-semibold'>{heading}</h5>
      </div>
      <div className={isDropped ? 'block' : 'hidden'}>{children}</div>
    </section>
  );
};

export default DropdownSection;
