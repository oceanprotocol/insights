import React, { useState } from "react";
import styles from "./style.module.scss";
import cs from "classnames";

import TableDownload from "./Table";
import Filter from "./Filter";

export default function ComputeHistory() {
  const [activeButton, setActiveButton] = useState("Published");

  const contentMap: { [key: string]: JSX.Element } = {
    Published: <Filter />,
    Download: <TableDownload />,
    "Compute Jobs": <div>No results found</div>,
  };

  const handleButtonClick = (buttonLabel: string) => {
    if (activeButton === buttonLabel) {
      setActiveButton("");
    } else {
      setActiveButton(buttonLabel);
    }
  };

  return (
    <div className="mt-5">
      <div className="d-flex justify-content-center">
        <button
          className={cs(styles.button, 'btnH', 'btn-primary', 'play20', {
            active: activeButton === 'Published',
          })}
          style={{
            border: activeButton === 'Published' ? '5px solid #212529' : '',
            background: activeButton === 'Published' ? '#212529' : '',
            color: activeButton === 'Published' ? 'white' : '',
            padding: activeButton === 'Published' ? '2px' : '',
          }}
          onClick={() => handleButtonClick('Published')}
        >
          PUBLISHED
        </button>
        <button
          className={cs(styles.button, 'btnH', 'btn-primary', 'play20', {
            active: activeButton === 'Download',
          })}
          style={{
            border: activeButton === 'Download' ? '5px solid #212529' : '',
            background: activeButton === 'Download' ? '#212529' : '',
            color: activeButton === 'Download' ? 'white' : '',
            padding: activeButton === 'Download' ? '2px' : '',
          }}
          onClick={() => handleButtonClick('Download')}
        >
          DOWNLOAD
        </button>
        <button
          className={cs(styles.button, 'btnH', 'btn-primary', 'play20', {
            active: activeButton === 'Compute Jobs',
          })}
          style={{
            border: activeButton === 'Compute Jobs' ? '5px solid #212529' : '',
            background: activeButton === 'Compute Jobs' ? '#212529' : '',
            color: activeButton === 'Compute Jobs' ? 'white' : '',
            padding: activeButton === 'Compute Jobs' ? '2px' : '',
          }}
          onClick={() => handleButtonClick('Compute Jobs')}
        >
          COMPUTE JOBS
        </button>
      </div>
      <div className={`text-white ${activeButton ? 'show' : ''}`}>
        <div className="card card-body d-flex justify-content-center align-items-center">
          {contentMap[activeButton]}
        </div>
      </div>
    </div>
  );
}
