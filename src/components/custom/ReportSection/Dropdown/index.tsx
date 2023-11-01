import react, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

type OptionsType = {
  id: number;
  name: string;
};


type DropdownPropType = {
  placeholder: string;
  options: OptionsType[];
  onSelect: (value: string) => void;
};

export default function PriceDropdown({
  placeholder,
  options,
  onSelect
}: DropdownPropType) {
  const [dropdownValue, setDropdownValue] = useState('');

  const handleSelect = (eventKey) => {
    setDropdownValue(eventKey);
    onSelect(eventKey);
  };

  return (
    <div className="mx-2">
      <Dropdown  onSelect={handleSelect}>
        <Dropdown.Toggle
          variant="success"
          id="dropdown-basic"
          className="d-flex justify-content-center align-items-center"
        >
          {placeholder+":"+dropdownValue} 
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {options.map((option) => {
            return <Dropdown.Item key={option.id} eventKey={option.name}>{option.name}</Dropdown.Item>;
          })}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
