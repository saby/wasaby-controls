/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { IDataCellComponentProps } from 'Controls/_gridRender/cell/interface/IDataCellComponent';

/**
 * Утилита, предоставляющая CSS классы для ячейки лесенки
 * @private
 */
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
