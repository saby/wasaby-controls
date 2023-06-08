import * as React from 'react';

interface ICellStyle {
    gridColumnStart: React.CSSProperties['gridColumnStart'];
    gridColumnEnd: React.CSSProperties['gridColumnEnd'];
}

export interface IUseGridSeparatedRowStylesProps {
    part?: 'scrollable' | 'fixed';
    stickyColumnsCount: number;
    hasMultiSelectColumn: boolean;
    hasResizer: boolean;
}

export default function useGridSeparatedRowStyles({
    part = 'scrollable',
    hasMultiSelectColumn,
    stickyColumnsCount,
    hasResizer,
}: IUseGridSeparatedRowStylesProps): {
    fixedCellStyle: ICellStyle;
    scrollableCellStyle: ICellStyle;
} {
    return React.useMemo(() => {
        let fixedCellStyle: ICellStyle;
        let scrollableCellStyle: ICellStyle;

        if (part === 'fixed') {
            const fullColumnStyle: ICellStyle = {
                gridColumnStart: '1',
                gridColumnEnd: '-1',
            };

            fixedCellStyle = fullColumnStyle;
            scrollableCellStyle = fullColumnStyle;
        } else {
            const fixedColumnsCount = stickyColumnsCount + +hasMultiSelectColumn;

            fixedCellStyle = {
                gridColumnStart: '1',
                gridColumnEnd: `${fixedColumnsCount + 1}`,
            };

            scrollableCellStyle = {
                gridColumnStart: `${fixedColumnsCount + +hasResizer + 1}`,
                gridColumnEnd: '-1',
            };
        }

        return {
            fixedCellStyle,
            scrollableCellStyle,
        };
    }, [part, hasMultiSelectColumn, stickyColumnsCount]);
}
