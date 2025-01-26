import { ICellPositionProps, IShadowProps } from 'Controls/interface';

export function getShadowClasses(props: ICellPositionProps & IShadowProps) {
    if (!props.shadowVisibility || props.shadowVisibility === 'hidden') {
        return '';
    }

    let shadowClasses = ` controls-ListView__item_shadow_${props.shadowVisibility}`;

    if (!props.isFirstCell && !props.isLastCell) {
        shadowClasses += ' controls-GridReact__cell_shadow-mask';
    }

    if (props.isFirstCell && !props.isLastCell) {
        shadowClasses += ' controls-GridReact__first-cell_shadow-mask';
    }

    if (props.isLastCell && !props.isFirstCell) {
        shadowClasses += ' controls-GridReact__last-cell_shadow-mask';
    }

    return shadowClasses;
}
