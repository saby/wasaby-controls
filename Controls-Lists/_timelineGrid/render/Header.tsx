import * as React from 'react';

import { TColumnDataDensity } from 'Controls-Lists/dynamicGrid';
import { date as formatDate } from 'Types/formatter';
import { IHeaderConfig, ICellProps } from 'Controls/gridReact';
import { Quantum } from 'Controls-Lists/_timelineGrid/utils';

export type TIsHolidayCallback = (date: Date) => boolean;

function HeaderDateComponent(props: {
    quantum: Quantum;
    dataDensity: TColumnDataDensity;
    renderValues?: { date?: Date };
    isHolidayCallback: TIsHolidayCallback;
}) {
    const {
        quantum,
        dataDensity,
        renderValues: { date },
        isHolidayCallback,
    } = props;

    let mask = '';
    switch (quantum) {
        case Quantum.Hour:
            mask = 'HH:mm';
            break;
        case Quantum.Day:
            if (dataDensity === 'advanced') {
                mask = 'D, ddl';
            } else {
                mask = 'D';
            }
            break;
        case Quantum.Month:
            mask = 'MMMl';
            break;
    }
    const fontColorStyle =
        quantum === Quantum.Day && isHolidayCallback?.(date) ? 'danger' : 'secondary';
    return <span className={`controls-text-${fontColorStyle}`}>{formatDate(date, mask)}</span>;
}

export function getPatchedDynamicHeader(
    dynamicHeader: IHeaderConfig,
    quantum: Quantum,
    isHolidayCallback: TIsHolidayCallback,
    dataDensity: TColumnDataDensity
): IHeaderConfig {
    return {
        render: (
            <HeaderDateComponent
                quantum={quantum}
                dataDensity={dataDensity}
                isHolidayCallback={isHolidayCallback}
            />
        ),
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
