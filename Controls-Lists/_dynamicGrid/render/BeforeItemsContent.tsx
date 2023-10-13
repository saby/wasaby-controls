import * as React from 'react';
import { TOffsetSize } from 'Controls/interface';
import {
    _useGridAutoScrollTargetsStyles as useGridAutoScrollTargetsStyles,
    _TUseGridAutoScrollTargetsStylesProps as TUseGridAutoScrollTargetsStylesProps,
} from 'Controls/gridColumnScroll';
import { AutoScrollTargetElement } from 'Controls/columnScrollReact';
import { TColumnKeys } from '../shared/types';
import { START_FIXED_PART_OBSERVER, END_FIXED_PART_OBSERVER } from '../shared/constants';
import { IDynamicHeaderCellsColspanCallback } from './Header';

export type TBeforeItemsContentProps = Omit<
    TUseGridAutoScrollTargetsStylesProps,
    'hasResizer' | 'columnsCount'
> & {
    children?: JSX.Element;
    dynamicColumns: TColumnKeys;
    columnsSpacing: TOffsetSize;
    dynamicColumnsColspanCallback?: IDynamicHeaderCellsColspanCallback;
};

function getPreparedColumns(
    dynamicColumns: TColumnKeys,
    dynamicColumnsColspanCallback?: IDynamicHeaderCellsColspanCallback,
    columnsSpacing?: TOffsetSize
) {
    const className = columnsSpacing
        ? `ControlsLists-dynamicGrid__autoScrollTarget_columns-spacing_${columnsSpacing}`
        : '';

    const gridColumns: {
        key: number;
        className: string;
        style: Pick<React.CSSProperties, 'gridColumnStart' | 'gridColumnEnd'>;
    }[] = [];
    let gridColumnsCount = 0;

    let colspanSize = 1;
    dynamicColumns.forEach((columnKey, columnIndex) => {
        if (colspanSize > 1) {
            colspanSize--;
            return;
        }
        colspanSize = dynamicColumnsColspanCallback
            ? dynamicColumnsColspanCallback(columnKey, columnIndex)
            : 1;

        gridColumns.push({
            key: columnIndex,
            className,
            style: {
                gridColumnStart: `${1 + gridColumnsCount}`,
                gridColumnEnd: `${1 + gridColumnsCount + colspanSize}`,
            },
        });

        gridColumnsCount += colspanSize;
    });

    return {
        gridColumns,
        gridColumnsCount,
    };
}

export function BeforeItemsContent(props: TBeforeItemsContentProps): JSX.Element {
    const { startFixedCellStyle, scrollableCellStyles, endFixedCellStyle } =
        useGridAutoScrollTargetsStyles({
            ...props,
            columnsCount: 1 + props.stickyColumnsCount + props.endStickyColumnsCount,
            hasResizer: false,
        });

    const { gridColumnsCount, gridColumns } = getPreparedColumns(
        props.dynamicColumns,
        props.dynamicColumnsColspanCallback,
        props.columnsSpacing
    );

    const wrapperStyles: React.CSSProperties = {
        ...scrollableCellStyles[0],
        gridTemplateColumns: `repeat(${gridColumnsCount}, auto)`,
    };

    return (
        <>
            <div className="tw-contents">
                {startFixedCellStyle && (
                    <div style={startFixedCellStyle} className={START_FIXED_PART_OBSERVER} />
                )}

                <div
                    className="ControlsLists-dynamicGrid__autoScrollTargetsWrapper"
                    style={wrapperStyles}
                >
                    {gridColumns.map((c) => (
                        <AutoScrollTargetElement
                            key={c.key}
                            style={c.style}
                            className={c.className}
                        />
                    ))}
                </div>

                {endFixedCellStyle && (
                    <div style={endFixedCellStyle} className={END_FIXED_PART_OBSERVER} />
                )}
            </div>

            {props.children}
        </>
    );
}

const BeforeItemsContentMemo = React.memo(BeforeItemsContent);
export default BeforeItemsContentMemo;
