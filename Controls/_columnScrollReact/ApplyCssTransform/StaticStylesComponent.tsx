/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import * as React from 'react';
import { ISelectorsState } from '../common/selectors';
import { QA_SELECTORS } from '../common/data-qa';

/**
 * Опции компонента StaticStylesComponent.
 */
export interface IStaticStylesComponentProps {
    /**
     * Селекторы горизонтального скролла из контекста.
     */
    selectors: ISelectorsState;
}

/**
 * Компонент, применяющий стили, зависящие только от селекторов из контекста.
 * Такие стили условно считаются статическими, т.к. не зависят от пользовательских действий.
 * Для применения стилей используется HTML тег style.
 */
export function StaticStylesComponent(
    props: IStaticStylesComponentProps
): React.FunctionComponentElement<IStaticStylesComponentProps> {
    return (
        <style data-qa={QA_SELECTORS.STATIC_STYLES_TAG}>
            {
                // Hardware acceleration.
                // A lot of transformations can be executed on the GPU instead of the CPU. This enables better performance
                // https://v2.tailwindcss.com/docs/transform
                `.${props.selectors.FIXED_ELEMENT} {` +
                    'transform: translate3d(0, 0, 0) rotate(0) skewX(0) skewY(0) scaleX(1) scaleY(1);' +
                    'will-change: transform;' +
                    '}' +
                    // Оправдано использование двух селекторов.
                    // Только с появлением необходимости прижимать контент к правой части станет рентабельным ввод
                    // общего селектора под любой фиксированный элемент, который будет исключительно
                    // утилитарным и не будет отвечать за трансформацию.
                    // Подробнее читайте в описании селекторов фиксации Controls/columnScrollReact:TSelectorsProps.
                    `.${props.selectors.HIDE_ALL_FIXED_ELEMENTS} .${props.selectors.FIXED_ELEMENT},` +
                    `.${props.selectors.HIDE_ALL_FIXED_ELEMENTS} .${props.selectors.FIXED_TO_RIGHT_EDGE_ELEMENT}` +
                    ' { visibility: hidden; }'
            }
        </style>
    );
}

export const StaticStylesComponentMemo = React.memo(StaticStylesComponent);
export default StaticStylesComponentMemo;
