import { ICellPositionProps } from 'Controls/interface';

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
