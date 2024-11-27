import { TBackgroundStyle } from 'Controls/interface';

export interface IGetBackgroundColorStyleClasses {
    backgroundColorStyle?: TBackgroundStyle;
    backgroundStyle?: TBackgroundStyle;
}

export function getBackgroundColorStyleClasses(
    backgroundColorStyle?: TBackgroundStyle,
    isSticky?: boolean
) {
    if (isSticky || !backgroundColorStyle || backgroundColorStyle === 'none') {
        return '';
    }

    return ` controls-background-${backgroundColorStyle}`;
}

export interface IGetHoverBackgroundColorStyleClasses {
    hoverBackgroundStyle?: TBackgroundStyle;
    highlightOnHover?: boolean;
    isStickyLadderCell?: boolean;
}

export function getHoverBackgroundColorStyleClasses(props: IGetHoverBackgroundColorStyleClasses) {
    if (
        !props.hoverBackgroundStyle ||
        props.hoverBackgroundStyle === 'none' ||
        props.highlightOnHover === false ||
        props.isStickyLadderCell
    ) {
        return '';
    }

    return ` controls-hover-background-${props.hoverBackgroundStyle}`;
}
