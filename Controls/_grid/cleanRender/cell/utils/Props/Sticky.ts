import { IBaseCellComponentProps } from 'Controls/_grid/cleanRender/cell/BaseCellComponent';
import { GridCell, GridRow } from 'Controls/baseGrid';

interface IGetStickyPropsParams {
    row: GridRow;
    cell: GridCell;
}
export function getStickyProps({
    cell,
    row,
}: IGetStickyPropsParams): Pick<
    IBaseCellComponentProps,
    | 'isSticky'
    | 'stickyMode'
    | 'stickyPosition'
    | 'fixedBackgroundStyle'
    | 'stickiedBackgroundStyle'
    | 'shadowVisibility'
    | 'pixelRatioBugFix'
    | 'subPixelArtifactFix'
> {
    return {
        isSticky: cell.isStickied(),
        stickyMode: cell.getStickyHeaderMode() as IBaseCellComponentProps['stickyMode'],
        stickyPosition: cell.getStickyHeaderPosition() as IBaseCellComponentProps['stickyPosition'],
        fixedBackgroundStyle: row.getFixedBackgroundStyle(),
        stickiedBackgroundStyle: cell.getStickyBackgroundStyle(),
        shadowVisibility: cell.isLadderCell() ? 'hidden' : cell.shadowVisibility,
        // todo стрельнет 100%, опцию надо передавать не через рендер строки/ячейки, а через пропсы списка прямо в метод
        pixelRatioBugFix: false,
        // todo аналогично pixelRatioBugFix
        subPixelArtifactFix: cell.isNeedSubPixelArtifactFix(),
    };
}
