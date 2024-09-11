/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import * as React from 'react';
import { IColumnScrollWidths } from '../common/interfaces';
import { ISelectorsState } from '../common/selectors';
import { QA_SELECTORS } from '../common/data-qa';

/**
 * Опции компонента IWidthsDependentStylesComponentProps.
 * @private
 */
export interface IWidthsDependentStylesComponentProps
    extends Pick<IColumnScrollWidths, 'startFixedWidth' | 'endFixedWidth' | 'viewPortWidth'> {
    /**
     * Селекторы горизонтального скролла из контекста.
     */
    selectors: ISelectorsState;
}

/**
 * Компонент, применяющий стили, зависящие только от размеров контекста.
 * Для применения стилей используется HTML тег style.
 * @private
 */
export function WidthsDependentStylesComponent(
    props: IWidthsDependentStylesComponentProps
): React.FunctionComponentElement<IWidthsDependentStylesComponentProps> {
    const value =
        `.${props.selectors.OFFSET_FOR_START_FIXED_ELEMENT} { left: ${props.startFixedWidth}px; } ` +
        `.${props.selectors.OFFSET_FOR_END_FIXED_ELEMENT} { right: ${props.endFixedWidth}px; } ` +
        `.${props.selectors.STRETCHED_TO_VIEWPORT_ELEMENT} { width: ${props.viewPortWidth}px; }`;
    return <style data-qa={QA_SELECTORS.WIDTH_STYLES_TAG}>{value}</style>;
}

export default WidthsDependentStylesComponent;
