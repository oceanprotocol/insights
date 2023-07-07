import React from "react";
import { NextPage } from "next";
import cs from "classnames";

import style from "./style.module.scss";

type AssetsDetailsPropType = {
  totalSales: number;
  sales: number;
};

const AssetsDetails: NextPage<AssetsDetailsPropType> = ({
  totalSales,
  sales,
}) => {
  return (
    <div
      className={cs(
        style.assetsDetails,
        "d-flex flex-md-row w-100 mt-2 mt-md-5 text-white"
      )}
    >
      <div
        className={cs(
          style.separator,
          "d-flex flex-column justify-content-center align-items-center col-6"
        )}
      >
        <div className="play40">
          {totalSales} <span className="play0">€</span>
        </div>
        <div className="play20">Total Sales</div>
      </div>
      <div
        className={cs(
          style.separator,
          "d-flex flex-column justify-content-center align-items-center col-6"
        )}
      >
        <div className="play40">{sales}</div>
        <div className="play20">Sales</div>
      </div>
    </div>
  );
};

export default AssetsDetails;
