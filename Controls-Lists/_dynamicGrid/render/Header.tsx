import * as React from 'react';
import { IHeaderConfig, CellComponent } from 'Controls/gridReact';
import { getDynamicHeaderCellClass, TColumnDataDensity, TQuantumType } from './utils';
import { getBaseDynamicColumn, IBaseDynamicColumnProps } from './BaseDynamicColumn';
import { TOffsetSize } from 'Controls/interface';

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
    columnsSpacing: TOffsetSize;
    quantum: TQuantumType;
    dataDensity: TColumnDataDensity;
}

function HeaderDynamicCells(props: IDynamicCellsProps) {
    const {
        render,
        dynamicColumnsGridData,
        dynamicHeaderCellsColspanCallback,
        columnsSpacing,
        quantum,
        dataDensity,
    } = props;

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
                className={getDynamicHeaderCellClass(renderValues.date, columnsSpacing, quantum, dataDensity)}
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
    dynamicHeader: IHeaderConfig;
    dynamicColumnsGridData: unknown[];
    dynamicHeaderCellsColspanCallback?: TDynamicHeaderCellsColspanCallback;
    quantum: TQuantumType;
    dataDensity: TColumnDataDensity;
}

export function getPreparedDynamicHeader(props: IGetPreparedDynamicHeaderProps) {
    const {
        dynamicColumn,
        dynamicHeader,
        dynamicColumnsCount,
        dynamicColumnsGridData,
        columnsSpacing,
        dynamicHeaderCellsColspanCallback,
        quantum,
        dataDensity,
    } = props;

    return getBaseDynamicColumn({
        dynamicColumn,
        dynamicColumnsCount,
        columnsSpacing,
        getCellProps: dynamicHeader.getCellProps,
        key: DYNAMIC_HEADER_PREFIX,
        render: (
            <HeaderDynamicCellsMemo
                render={dynamicHeader.render}
                dynamicColumnsGridData={dynamicColumnsGridData}
                dynamicHeaderCellsColspanCallback={dynamicHeaderCellsColspanCallback}
                columnsSpacing={columnsSpacing}
                quantum={quantum}
                dataDensity={dataDensity}
            />
        ),
    });
}