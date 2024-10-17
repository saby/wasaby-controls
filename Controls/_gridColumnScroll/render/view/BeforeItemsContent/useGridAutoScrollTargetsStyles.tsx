/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import useGridSeparatedRowStyles, {
    TUseGridSeparatedRowStylesProps,
    ICellStyle,
} from './useGridSeparatedRowStyles';
import * as React from 'react';

export type TUseGridAutoScrollTargetsStylesProps = Omit<TUseGridSeparatedRowStylesProps, 'part'> & {
    columnsCount: number;
};

const parseValue = (value: React.CSSProperties['gridColumnStart'] | undefined): number => {
    switch (typeof value) {
        case 'number': {
            return value;
        }
        case 'undefined': {
            return 0;
        }
        default: {
            const parsed = Number.parseInt(value, 10);
            return Number.isNaN(parsed) ? 0 : parsed;
        }
    }
};

export function useGridAutoScrollTargetsStyles(props: TUseGridAutoScrollTargetsStylesProps): Omit<
    ReturnType<typeof useGridSeparatedRowStyles>,
    'scrollableCellStyle'
> & {
    scrollableCellStyles: ICellStyle[];
} {
    const { startFixedCellStyle, scrollableCellStyle, endFixedCellStyle } =
        useGridSeparatedRowStyles({
            part: 'scrollable',
            ...props,
        });

    const scrollableCount =
        props.columnsCount - props.stickyColumnsCount - props.endStickyColumnsCount;

    const startIndex = parseValue(scrollableCellStyle.gridColumnStart);

    return {
        startFixedCellStyle,
        scrollableCellStyles: Array.from({ length: scrollableCount }, (_, index) => ({
            gridColumnStart: `${startIndex + index}`,
            gridColumnEnd: `${startIndex + index + 1}`,
        })),
        endFixedCellStyle,
    };
}

export default useGridAutoScrollTargetsStyles;
