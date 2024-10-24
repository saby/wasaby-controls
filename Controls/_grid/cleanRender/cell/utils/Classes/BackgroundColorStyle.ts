import { TBackgroundStyle } from 'Controls/interface';

export interface IGetBackgroundColorStyleClasses {
    backgroundColorStyle?: TBackgroundStyle;
    backgroundStyle?: TBackgroundStyle;
}

export function getBackgroundColorStyleClasses(backgroundColorStyle?: TBackgroundStyle) {
    return backgroundColorStyle
        ? ` controls-background-${backgroundColorStyle} controls-background-hover-color_list`
        : '';
}

export interface IGetHoverBackgroundColorStyleClasses {
    hoverBackgroundStyle?: TBackgroundStyle;
    highlightOnHover?: boolean;
    isStickyLadderCell?: boolean;
}

export function getHoverBackgroundColorStyleClasses({
    hoverBackgroundStyle,
    highlightOnHover,
    isStickyLadderCell,
}: IGetHoverBackgroundColorStyleClasses) {
    if (
        hoverBackgroundStyle &&
        hoverBackgroundStyle !== 'none' &&
        highlightOnHover !== false &&
        !isStickyLadderCell
    ) {
        return ` controls-hover-background-${hoverBackgroundStyle}`;
    }

    return '';
}
