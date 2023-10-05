/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
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
    return (
        <style data-qa={QA_SELECTORS.WIDTH_STYLES_TAG}>
            {`.${props.selectors.OFFSET_FOR_START_FIXED_ELEMENT} { left: ${props.startFixedWidth}px; }`}
            {`.${props.selectors.OFFSET_FOR_END_FIXED_ELEMENT} { right: ${props.endFixedWidth}px; } `}
            {`.${props.selectors.STRETCHED_TO_VIEWPORT_ELEMENT} { width: ${props.viewPortWidth}px; }`}
        </style>
    );
}

export const WidthsDependentStylesComponentMemo = React.memo(WidthsDependentStylesComponent);
export default WidthsDependentStylesComponentMemo;
