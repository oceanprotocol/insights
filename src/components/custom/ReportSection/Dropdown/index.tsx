import react, { useState } from 'react';
import cs from 'classnames';
import Dropdown from 'react-bootstrap/Dropdown';
import styles from './styles.module.scss';

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
  onSelect,
}: DropdownPropType) {
  const [dropdownValue, setDropdownValue] = useState('');

  const handleSelect = (eventKey) => {
    setDropdownValue(eventKey);
    onSelect(eventKey);
  };

  return (
    <div className="mx-2">
      <Dropdown onSelect={handleSelect}>
        <Dropdown.Toggle
          variant="success"
          id="dropdown-basic"
          className={cs(
            styles.dropdown,
            'd-flex justify-content-center align-items-center my-0'
          )}
        >
          {dropdownValue && dropdownValue.length > 0
            ? dropdownValue
            : placeholder}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {options.map((option) => {
            return (
              <Dropdown.Item key={option.id} eventKey={option.name}>
                {option.name}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
