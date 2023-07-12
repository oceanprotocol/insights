import { useMemo } from "react";

type ColumnpropType = {
  id: number;
  title: string;
};

type RowpropType = {
    id: number;
    title: string;
  };

export default function ColumnDownload() {
  const ColumnData: ColumnpropType[] = useMemo(() => [
    {
      id: 1,
      title: "Dataset",
    },
    {
      id: 2,
      title: "Network",
    },
    {
      id: 3,
      title: "Datatoken",
    },
    {
      id: 4,
      title: "Time",
    },
  ],
  [],
  );

  const RowData: RowpropType[] = useMemo(() => [
    {
        id:1,
        title: "Dataset1"
    },
    {
        id:2,
        title: "Network1"
    },
    {
        id:3,
        title: "Datatoken1"
    },
    {
        id:4,
        title: "Time1"
    },
  ],
  [],
  );

  return { ColumnData, RowData }
}
