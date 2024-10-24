/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import * as React from 'react';
import { IColumnScrollWidths } from '../common/interfaces';
import { ISelectorsState } from '../common/selectors';
import { QA_SELECTORS } from '../common/data-qa';

/**
 * Опции компонента IWidthsDependentStylesComponentProps.
 */
export interface IWidthsDependentStylesComponentProps
    extends Pick<IColumnScrollWidths, 'startFixedWidth' | 'endFixedWidth' | 'viewPortWidth'> {
    /**
     * Селекторы горизонтального скролла из контекста.
     */
    selectors: ISelectorsState;
    /**
     * Отображается ли горизонтальный скролл вв зависимости от ширины.
     */
    isNeedByWidth: boolean;
}

/**
 * Компонент, применяющий стили, зависящие только от размеров контекста.
 * Для применения стилей используется HTML тег style.
 */
export function WidthsDependentStylesComponent(
    props: IWidthsDependentStylesComponentProps
): React.FunctionComponentElement<IWidthsDependentStylesComponentProps> {
    let value =
        `.${props.selectors.OFFSET_FOR_START_FIXED_ELEMENT} { left: ${props.startFixedWidth}px; } ` +
        `.${props.selectors.OFFSET_FOR_END_FIXED_ELEMENT} { right: ${props.endFixedWidth}px; }`;
    if (props.isNeedByWidth) {
        value += `.${props.selectors.STRETCHED_TO_VIEWPORT_ELEMENT} { width: ${props.viewPortWidth}px; }`;
        value += `.${props.selectors.ROOT_TRANSFORMED_ELEMENT} .controls-Grid__header-cell_withColumnScrollArrows { padding-bottom: calc( var(--inline_height_ArrowButton) + 2 * var(--offset_2xs) ); }`;
    }
    return <style data-qa={QA_SELECTORS.WIDTH_STYLES_TAG}>{value}</style>;
}

export default WidthsDependentStylesComponent;
