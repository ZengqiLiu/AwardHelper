import React, { forwardRef } from 'react';
import InputDropdownGroup from '../../components/InputDropdownGroup';

const OperatorInput = forwardRef(({ onInputChange }, ref) => {
  const operatorLabelFormatter = () => `Operating Ailine:`;
    
  return (
    <InputDropdownGroup 
      ref={ref}
      onInputChange={onInputChange}
      fetchData={null}
      labelFormatter={operatorLabelFormatter}
      placeholder="Select an operating airline"
      maxCount={1}
      initialCount={1}
      fetchOnMount={false}
    />
  );
});

export default OperatorInput;