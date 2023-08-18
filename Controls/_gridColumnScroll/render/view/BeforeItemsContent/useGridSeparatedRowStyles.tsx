import * as React from 'react';

interface ICellStyle {
    gridColumnStart: React.CSSProperties['gridColumnStart'];
    gridColumnEnd: React.CSSProperties['gridColumnEnd'];
}

export interface IUseGridSeparatedRowStylesProps {
    part?: 'scrollable' | 'fixed';
    stickyColumnsCount: number;
    endStickyColumnsCount: number;
    hasMultiSelectColumn: boolean;
    hasResizer: boolean;
}

export default function useGridSeparatedRowStyles({
    part = 'scrollable',
    hasMultiSelectColumn,
    stickyColumnsCount,
    endStickyColumnsCount,
    hasResizer: hasResizerByProps,
}: IUseGridSeparatedRowStylesProps): {
    startFixedCellStyle: ICellStyle;
    scrollableCellStyle: ICellStyle;
    endFixedCellStyle?: ICellStyle
} {
    return React.useMemo(() => {
        let startFixedCellStyle: ICellStyle;
        let scrollableCellStyle: ICellStyle;
        let endFixedCellStyle: ICellStyle;

        if (part === 'fixed') {
            const fullColumnStyle: ICellStyle = {
                gridColumnStart: '1',
                gridColumnEnd: '-1',
            };

            startFixedCellStyle = fullColumnStyle;
            scrollableCellStyle = fullColumnStyle;
            endFixedCellStyle = fullColumnStyle;
        } else {
            const fixedColumnsCount = stickyColumnsCount + +hasMultiSelectColumn;
            const hasResizer = hasResizerByProps && fixedColumnsCount !== 0;

            if (fixedColumnsCount !== 0) {
                startFixedCellStyle = {
                    gridColumnStart: '1',
                    gridColumnEnd: `${fixedColumnsCount + 1}`,
                };
            }

            scrollableCellStyle = {
                gridColumnStart: `${fixedColumnsCount + +hasResizer + 1}`,
                gridColumnEnd: `-${ 1 + endStickyColumnsCount }`,
            };

            if (endStickyColumnsCount !== 0) {
                endFixedCellStyle = {
                    gridColumnStart: `-${ 1 + endStickyColumnsCount }`,
                    gridColumnEnd: '-1',
                };
            }
        }

        return {
            startFixedCellStyle,
            scrollableCellStyle,
            endFixedCellStyle,
        };
    }, [part, stickyColumnsCount, hasMultiSelectColumn, hasResizerByProps, endStickyColumnsCount]);
}
