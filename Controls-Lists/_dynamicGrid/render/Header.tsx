import * as React from 'react';
import { IHeaderConfig, CellComponent } from 'Controls/gridReact';
import { getDynamicHeaderCellClass } from './utils';
import { getBaseDynamicColumn, IBaseDynamicColumnProps } from './BaseDynamicColumn';

const DYNAMIC_HEADER_PREFIX = '$DYNAMIC_HEADER_';

/*
export function getPreparedDynamicHeader(
    date: Date,
    dynamicHeader: IHeaderConfig,
    isHolidayCallback: TIsHolidayCallback
): IColumnConfig {
    return {
        ...dynamicHeader,
        key: DYNAMIC_HEADER_PREFIX + date.getTime(),
        render: <DynamicHeaderRender date={date} />,
        getCellProps: () => {
            const customProps = dynamicHeader?.getCellProps?.();
            const isHoliday = isHolidayCallback ? isHolidayCallback(date) : false;
            return {
                ...customProps,
                backgroundStyle: customProps ? customProps.backgroundStyle : 'unaccented',
                valign: customProps ? customProps.valign : 'center',
                fontColorStyle: isHoliday ? 'danger' : 'secondary',
            };
        },
    };
}
*/

export type TDynamicHeaderCellsColspanCallback<TColumnKey = unknown> = (columnKey: TColumnKey, index: number) => number;

interface IDynamicCellsProps {
    render: React.ReactElement;
    dynamicColumnsGridData: unknown[];
    dynamicHeaderCellsColspanCallback?: TDynamicHeaderCellsColspanCallback;
}

function HeaderDynamicCells(props: IDynamicCellsProps) {
    const { render, dynamicColumnsGridData, dynamicHeaderCellsColspanCallback } = props;

    const cells: React.ReactElement[] = [];

    let colspanSize = 1;
    dynamicColumnsGridData.forEach((value, index) => {
        // Скипаем ячейки, которые были заколспанены
        if (colspanSize > 1) {
            colspanSize--;
            return;
        }

        const date = dynamicColumnsGridData[index] as Date;
        const renderValues = {
            date,
        };
        const ContentRender = React.cloneElement(render, {
            renderValues,
        });

        colspanSize = dynamicHeaderCellsColspanCallback(date, index);
        const colspanStart = index + 1;
        const colspanEnd = colspanStart + colspanSize;
        cells.push(
            <CellComponent
                key={DYNAMIC_HEADER_PREFIX + date.getTime()}
                className={getDynamicHeaderCellClass(renderValues.date)}
                render={ContentRender}
                paddingLeft={null}
                paddingRight={null}
                paddingTop={null}
                paddingBottom={null}
                startColspanIndex={colspanStart}
                endColspanIndex={colspanEnd}
                startRowspanIndex={1}
                backgroundStyle="unaccented"
                valign="center"
            />
        );
    });

    return cells;
}
export const HeaderDynamicCellsMemo = React.memo(HeaderDynamicCells);

interface IGetPreparedDynamicHeaderProps extends IBaseDynamicColumnProps {
    columnIndex: number;
    dynamicHeader: IHeaderConfig;
    dynamicColumnsGridData: unknown[];
    dynamicHeaderCellsColspanCallback?: TDynamicHeaderCellsColspanCallback;
}

export function getPreparedDynamicHeader(props: IGetPreparedDynamicHeaderProps) {
    const {
        columnIndex,
        dynamicColumn,
        dynamicHeader,
        dynamicColumnsCount,
        dynamicColumnsGridData,
        columnsSpacing,
        dynamicHeaderCellsColspanCallback,
    } = props;

    return getBaseDynamicColumn({
        dynamicColumn,
        dynamicColumnsCount,
        columnsSpacing,
        getCellProps: dynamicHeader.getCellProps,
        key: DYNAMIC_HEADER_PREFIX + columnIndex,
        render: (
            <HeaderDynamicCellsMemo
                render={dynamicHeader.render}
                dynamicColumnsGridData={dynamicColumnsGridData}
                dynamicHeaderCellsColspanCallback={dynamicHeaderCellsColspanCallback}
            />
        ),
    });
}
