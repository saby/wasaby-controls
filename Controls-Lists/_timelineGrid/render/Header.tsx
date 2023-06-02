import * as React from 'react';

import { date as formatDate } from 'Types/formatter';
import { IHeaderConfig, ICellProps } from 'Controls/gridReact';
import { Quantum } from 'Controls-Lists/_timelineGrid/utils';

function HeaderDateComponent(props: { quantum: Quantum; renderValues?: { date?: Date } }) {
    const {
        quantum,
        renderValues: { date },
    } = props;

    let mask = '';
    switch (quantum) {
        case Quantum.Hour:
            mask = 'HH:mm';
            break;
        case Quantum.Day:
            const columnWidth = 0;
            const maxWidthForSmallDay = 80;
            if (columnWidth < maxWidthForSmallDay) {
                mask = 'D';
            } else {
                mask = 'D, ddl';
            }
            break;
        case Quantum.Month:
            mask = 'MMMl';
            break;
    }

    return <>{formatDate(date, mask)}</>;
}

export function getPatchedDynamicHeader(
    dynamicHeader: IHeaderConfig,
    quantum: Quantum
): IHeaderConfig {
    return {
        render: <HeaderDateComponent quantum={quantum} />,
        getCellProps: (): ICellProps => {
            // Отступы отключаются, чтобы они не суммировались с отступами внутренних ячеек
            return {
                padding: {
                    left: 'null',
                    right: 'null',
                },
            };
        },
        ...dynamicHeader,
    };
}
