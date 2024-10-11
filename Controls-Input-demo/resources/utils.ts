import {
    TInnerLabel,
    TOuterIconLabel,
    TOuterTextLabel,
    TCaptionLabel,
} from 'Controls-Input/interface';

export function getInnerLabel(): TInnerLabel {
    return {
        jumping: true,
    };
}

export function getOuterTextLabel(
    label: string,
    labelPosition: 'start' | 'top' | 'captionStart' | 'captionEnd' = 'top'
): TOuterTextLabel | TCaptionLabel {
    return {
        label,
        labelPosition,
    };
}

export function getOuterIconLabel(icon: string = 'icon-SabyBird'): TOuterIconLabel {
    return {
        icon,
    };
}
