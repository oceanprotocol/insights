import React from "react";
import useData from "./useData";
import cx from "classnames";

import style from "./style.module.scss";

export default function TableDownload() {
  const { ColumnData, RowData } = useData();
  return (
    <>
      <table className={cx(style.customTable,"table table-dark")}>
        <thead>
          <tr>
            {ColumnData.map((column) => {
              return (
                <th scope="col" key={column.id}>
                  {column.title}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          <tr>
          {RowData.map((row) => {
              return (
                <td scope="row" key={row.id}>
                  {row.title}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </>
  );
}
