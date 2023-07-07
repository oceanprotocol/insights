import React, { useState } from "react";
import styles from "./style.module.scss";
import cs from "classnames";

export default function ComputeHistory() {
  const [activeButton, setActiveButton] = useState("Published");

  const contentMap: { [key: string]: string } = {
    Published: "Conținutul pentru Published",
    Download: "Conținutul pentru Download",
    "Compute Jobs": "Conținutul pentru Compute Jobs",
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
        <p>
          <button
            className={cs("btnH", "btn-primary", "play20", "publishedButton", {
              active: activeButton === "Published",
            })}
            style={{
              border: activeButton === "Published" ? "10px solid red" : "",
              background: activeButton === "Published" ? "red" : "",
              borderRadius: activeButton === "Published" ? "50px" : "",
              padding: activeButton === "Published" ? "2px" : "",
            }}
            onClick={() => handleButtonClick("Published")}
          >
            Published
          </button>
          <button
            className={cs("btnH", "btn-primary", "play20", "downloadButton", {
              active: activeButton === "Download",
            })}
            style={{
              border: activeButton === "Download" ? "10px solid red" : "",
              background: activeButton === "Download" ? "red" : "",
              borderRadius: activeButton === "Download" ? "50px" : "",
              padding: activeButton === "Download" ? "2px" : "",
            }}
            onClick={() => handleButtonClick("Download")}
          >
            Download
          </button>
          <button
            className={cs(
              "btnH",
              "btn-primary",
              "play20",
              "computeJobsButton",
              {
                active: activeButton === "Compute Jobs",
              }
            )}
            style={{
              border: activeButton === "Compute Jobs" ? "10px solid red" : "",
              background: activeButton === "Compute Jobs" ? "red" : "",
              borderRadius: activeButton === "Compute Jobs" ? "50px" : "",
              padding: activeButton === "Compute Jobs" ? "2px" : "",
            }}
            onClick={() => handleButtonClick("Compute Jobs")}
          >
            Compute Jobs
          </button>
        </p>
      </div>
      <div
        className={`collapse text-white ${activeButton ? "show" : ""}`}
        id="collapse"
      >
        <div className="card card-body">{contentMap[activeButton]}</div>
      </div>
    </div>
  );
}
