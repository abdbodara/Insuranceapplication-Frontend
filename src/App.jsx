import React, { useState } from 'react';
import './App.css';
import FormInput from './components/InsuranceFormInput';
import Table from './components/InsuranceTable';

function App() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  return (
    <div className="flex items-start py-5 justify-center min-h-screen">
      <Table isOpen={isOpen} setIsOpen={setIsOpen} setSelectedPersonId={setSelectedPersonId}/>
      <FormInput isOpen={isOpen} setIsOpen={setIsOpen} selectedPersonId={selectedPersonId}/>
    </div>
  );
} 

export default App;
