import * as React from 'react';
import { IHeaderConfig, CellComponent } from 'Controls/gridReact';
import { getDynamicHeaderCellClass } from './utils';
import { TQuantumType, TColumnDataDensity } from '../shared/types';
import { getBaseDynamicColumn, IBaseDynamicColumnProps } from './BaseDynamicColumn';
import { TOffsetSize } from 'Controls/interface';
import { THoverMode } from '../interfaces/IDynamicGridComponent';

const DYNAMIC_HEADER_PREFIX = '$DYNAMIC_HEADER_';

export type TDynamicHeaderCellsColspanCallback<TColumnKey = unknown> = (
    columnKey: TColumnKey,
    index: number
) => number;

function shouldHoverSeparatedHeaderCell(
    quantum: TQuantumType,
    dataDensity: TColumnDataDensity
): boolean {
    return quantum !== 'day' || dataDensity === 'advanced';
}

interface IDynamicCellsProps {
    render: React.ReactElement;
    dynamicColumnsGridData: unknown[];
    dynamicHeaderCellsColspanCallback?: TDynamicHeaderCellsColspanCallback;
    columnsSpacing: TOffsetSize;
    quantum: TQuantumType;
    dataDensity: TColumnDataDensity;
    hoverMode?: THoverMode;
}

function HeaderDynamicCells(props: IDynamicCellsProps) {
    const {
        render,
        dynamicColumnsGridData,
        dynamicHeaderCellsColspanCallback,
        columnsSpacing,
        quantum,
        dataDensity,
        hoverMode,
    } = props;

    const cells: React.ReactElement[] = [];

    const hoverBackgroundStyle = shouldHoverSeparatedHeaderCell(quantum, dataDensity)
        ? 'unaccented'
        : null;

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

        colspanSize = dynamicHeaderCellsColspanCallback
            ? dynamicHeaderCellsColspanCallback(date, index)
            : 1;
        const colspanStart = index + 1;
        const colspanEnd = colspanStart + colspanSize;
        cells.push(
            <CellComponent
                key={DYNAMIC_HEADER_PREFIX + (date instanceof Date ? date.getTime() : date)}
                className={getDynamicHeaderCellClass(
                    renderValues.date,
                    columnsSpacing,
                    quantum,
                    dataDensity,
                    hoverMode
                )}
                render={ContentRender}
                paddingLeft={null}
                paddingRight={null}
                paddingTop={null}
                paddingBottom={null}
                startColspanIndex={colspanStart}
                endColspanIndex={colspanEnd}
                startRowspanIndex={1}
                backgroundStyle="unaccented"
                hoverBackgroundStyle={hoverBackgroundStyle}
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
    hoverMode?: THoverMode;
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
        hoverMode,
    } = props;

    const hoverClassName = shouldHoverSeparatedHeaderCell(quantum, dataDensity)
        ? 'ControlsLists-timelineGrid__headerSeparatedCellHover'
        : null;

    return getBaseDynamicColumn({
        dynamicColumn,
        dynamicColumnsCount,
        columnsSpacing,
        getCellProps: dynamicHeader.getCellProps,
        key: DYNAMIC_HEADER_PREFIX,
        className: hoverClassName,
        render: (
            <HeaderDynamicCellsMemo
                render={dynamicHeader.render}
                dynamicColumnsGridData={dynamicColumnsGridData}
                dynamicHeaderCellsColspanCallback={dynamicHeaderCellsColspanCallback}
                columnsSpacing={columnsSpacing}
                quantum={quantum}
                dataDensity={dataDensity}
                hoverMode={hoverMode}
            />
        ),
    });
}
