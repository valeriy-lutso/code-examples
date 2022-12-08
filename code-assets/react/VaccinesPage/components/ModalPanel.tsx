import React from 'react';

export interface ModalPanelProps {
  isOpen: boolean;
  title: string;
}

const ModalPanel: React.FC<ModalPanelProps> = ({ isOpen = false, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed right-0 top-0 h-full w-full bg-black-main bg-opacity-30 z-10 overflow-auto'>
      <div className='fixed top-0 right-0 h-screen flex flex-col gap-8 p-8 bg-background w-155.5 overflow-auto'>
        <h4>{title}</h4>
        <div className='flex justify-between overflow-overlay h-full'>{children}</div>
      </div>
    </div>
  );
};

export default ModalPanel;
