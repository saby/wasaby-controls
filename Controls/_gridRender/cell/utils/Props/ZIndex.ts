// z-index ячеек, застиканных по вертикали снизу (стики-итоги снизу, стики-футер)
const FixedBottomZIndex = 1;
// z-index ячеек, застиканных по вертикали сверху (стики-итоги сверху, стики-шапка)
const FixedTopZIndex = 3;
// z-index ячеек, застиканных по горизонтали и вертикали (скролл колонок + стики-шапки или стики-итоги сверху)
const FixedHorizontalTopZIndex = FixedTopZIndex + 1;

/*
 * Утилита возвращает z-index стики-ячеек в застиканном состоянии
 */
export default function getFixedZIndex(
    hasColumnScroll: boolean,
    columnScrollIsFixedCell: boolean,
    position: 'top' | 'bottom' = 'top'
): number {
    return hasColumnScroll && columnScrollIsFixedCell
        ? FixedHorizontalTopZIndex
        : position === 'top'
        ? FixedTopZIndex
        : FixedBottomZIndex;
}
