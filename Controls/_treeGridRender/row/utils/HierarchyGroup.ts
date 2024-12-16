import { TGroupViewMode } from 'Controls/display';

interface IGetGroupChildRowComponentClasses {
    isGroupChild: boolean;
    isFirstChildItem: boolean;
    isLastChildItem: boolean;
    groupViewMode: TGroupViewMode;
}

// На RowComponent, расположенные внутри блока с группой необходимо
// добавить классы сгруппированных записей. Это нужно, чтобы не писать тяжёлые CSS каскады.
export function getGroupChildRowComponentClasses(props: IGetGroupChildRowComponentClasses): string {
    let className = '';
    if (
        props.isGroupChild &&
        props.groupViewMode &&
        ['blocks', 'titledBlocks'].indexOf(props.groupViewMode) !== -1
    ) {
        className += ' controls-ListView__item_grouped';
        if (props.isFirstChildItem) {
            className += ` controls-ListView__item_grouped_${props.groupViewMode}_first`;
        }
        if (props.isLastChildItem) {
            className += ` controls-ListView__item_grouped_${props.groupViewMode}_last`;
        }
    }
    return className;
}
