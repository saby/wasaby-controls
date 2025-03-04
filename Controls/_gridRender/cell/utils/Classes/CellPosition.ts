/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { ICellPositionProps } from 'Controls/interface';

/**
 * Утилита, предоставляющая CSS классы, позволяющие определить положение ячейки в строке
 * @private
 */
export function getCellPositionClasses(props: ICellPositionProps) {
    let cellPositionClasses = '';

    if (props.isFirstCell) {
        cellPositionClasses += ' controls-GridReact__cell_first';
    }

    if (props.isLastCell) {
        cellPositionClasses += ' controls-GridReact__cell_last';
    }

    return cellPositionClasses;
}
