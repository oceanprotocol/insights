import React, { useState } from "react";
import cs from 'classnames';

import styles from './style.module.scss';

const itemsButton = [
  {
    id: 1,
    title: "DATASETS",
    result: "1",
  },
  {
    id: 2,
    title: "ALGORITHMS",
    result: "2",
  },
  {
    id: 3,
    title: "DOWNLOAD",
    result: "3",
  },
  {
    id: 4,
    title: "COMPUTE",
    result: "4",
  },
];

export default function Filter() {
  const [active, setActive] = useState(0);

  return (
    <>
      <div>
        {itemsButton.map((item) => {
          return (
            <button
              key={item.id}
              className={cs(styles.btn)}
              onClick={() => setActive(item.id)}
            >
              {item.title}
            </button>
          );
        })}
      </div>
      <div className={styles.container}>
        {itemsButton.map((item) => {
          return (
            <div
              key={item.id}
              className={cs(
                styles.filterDiv,
                active === item.id ? styles.activeDiv : ''
              )}
            >
              {item.result}
            </div>
          );
        })}
      </div>
    </>
  );
}
