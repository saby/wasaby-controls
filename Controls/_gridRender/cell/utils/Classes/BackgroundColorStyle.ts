/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { TBackgroundStyle } from 'Controls/interface';

export interface IGetBackgroundColorStyleClasses {
    backgroundColorStyle?: TBackgroundStyle;
    backgroundStyle?: TBackgroundStyle;
}

/**
 * Утилита, предоставляющая CSS классы фона ячейки
 * @private
 */
export function getBackgroundColorStyleClasses(
    backgroundColorStyle?: TBackgroundStyle,
    isSticky?: boolean,
    isActive?: boolean
) {
    if (!isActive && (isSticky || !backgroundColorStyle || backgroundColorStyle === 'none')) {
        return '';
    }

    return ` controls-background-${backgroundColorStyle}`;
}

export interface IGetHoverBackgroundColorStyleClasses {
    hoverBackgroundStyle?: TBackgroundStyle;
    highlightOnHover?: boolean;
    isStickyLadderCell?: boolean;
}

/**
 * Утилита, предоставляющая CSS классы фона ячейки при наведении мыши
 * @private
 */
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
