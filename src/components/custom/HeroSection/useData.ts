import { useMemo } from 'react';

export default function useData() {
    const TotalData = useMemo(
        () => [
            {
                id:1,
                number: '100.986',
                text: 'Data Available'
            },
            {
                id:2,
                number: '987.765',
                text: 'active users'
            },
            {
                id:3,
                number: 'Over 500',
                text: 'datasets available'
            },
            {
                id:4,
                number: '5',
                text: 'minutes av. time to analyse a dataset'
            },
        ],
        [],
    );

    return { TotalData };
}