import { TInnerLabel, TOuterIconLabel, TOuterTextLabel } from 'Controls-Input/interface';

export function getInnerLabel(label: string): TInnerLabel {
    return {
        label,
        jumping: true
    };
}

export function getOuterTextLabel(label: string, labelPosition: 'start' | 'top' = 'top'): TOuterTextLabel {
    return {
        label,
        labelPosition
    };
}

export function getOuterIconLabel(icon: string = 'icon-SabyBird'): TOuterIconLabel {
    return {
        icon
    };
}