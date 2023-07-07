import react from "react";
import Dropdown from "react-bootstrap/Dropdown";
import cx from "classnames";

import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";

type OptionsType = {
  id: number;
  name: string;
};

type DropdownPropType = {
  placeholder: string;
  options: OptionsType[];
};

export default function PriceDropdown({
  placeholder,
  options,
}: DropdownPropType) {
  const { t } = useTranslation(["common"]);
  return (
    <div className="mx-2">
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic" className="d-flex justify-content-center align-items-center">
          {placeholder}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {options.map((option) => {
            return <Dropdown.Item key={option.id}>{option.name}</Dropdown.Item>;
          })}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
