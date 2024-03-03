/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import * as React from 'react';
import { ISelectorsState } from '../common/selectors';
import { IColumnScrollWidths } from '../common/interfaces';
import { getTransformCSSRule, getMaxScrollPosition } from '../common/helpers';
import { QA_SELECTORS } from '../common/data-qa';

/**
 * Опции компонента PositionDependentStylesComponent.
 * @private
 */
export interface IPositionDependentStylesComponentProps extends IColumnScrollWidths {
    /**
     * Селекторы горизонтального скролла из контекста.
     */
    selectors: ISelectorsState;
    /**
     * Текущая позиция скролла.
     */
    position: number;
}

/**
 * Компонент, применяющий стили, зависимые от позиции скролла.
 * Для применения стилей используется HTML тег style.
 * @private
 */
export function PositionDependentStylesComponent(
    props: IPositionDependentStylesComponentProps
): React.FunctionComponentElement<IPositionDependentStylesComponentProps> {
    const styles =
        `.${props.selectors.ROOT_TRANSFORMED_ELEMENT} {${getTransformCSSRule(-props.position)}}` +
        `.${props.selectors.FIXED_ELEMENT} {${getTransformCSSRule(props.position)}}` +
        `.${props.selectors.FIXED_TO_RIGHT_EDGE_ELEMENT} {${getTransformCSSRule(
            props.position - getMaxScrollPosition(props)
        )}`;

    return <style data-qa={QA_SELECTORS.POSITION_STYLES_TAG}>{styles}</style>;
}

export const PositionDependentStylesComponentMemo = React.memo(PositionDependentStylesComponent);
export default PositionDependentStylesComponentMemo;
