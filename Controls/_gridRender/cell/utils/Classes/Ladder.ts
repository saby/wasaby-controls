import { IDataCellComponentProps } from 'Controls/_gridRender/cell/interface/IDataCellComponent';

export function getLadderClasses(
    props: Pick<IDataCellComponentProps, 'isStickyLadderCell' | 'paddingTop' | 'actionsPosition'>
) {
    if (!props.isStickyLadderCell) {
        return '';
    }

    let ladderClasses =
        ' controls-Grid__row-ladder-cell__content' +
        ` controls-Grid__row-ladder-cell__content_${props.paddingTop}`;

    const isPointerEventsDisabled = props.actionsPosition === 'outside';

    if (isPointerEventsDisabled) {
        ladderClasses += ' tw-pointer-events-none';
    }

    return ladderClasses;
}
