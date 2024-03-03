/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import useGridSeparatedRowStyles, {
    TUseGridSeparatedRowStylesProps,
    ICellStyle,
} from './useGridSeparatedRowStyles';

export type TUseGridAutoScrollTargetsStylesProps = Omit<TUseGridSeparatedRowStylesProps, 'part'> & {
    columnsCount: number;
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

    const startIndex = +scrollableCellStyle.gridColumnStart;

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
