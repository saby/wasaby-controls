/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import * as React from 'react';
import { ISelectorsState } from '../common/selectors';
import { createAnimation } from './smoothTransformAnimationUtil';
import { QA_SELECTORS } from '../common/data-qa';
import { IColumnScrollWidths } from '../common/interfaces';
import { getMaxScrollPosition } from '../common/helpers';

const DEFAULT_ANIMATION_DURATION = '0.25s';

/**
 * Опции компонента SmoothScrollingAnimationComponent.
 */
export interface ISmoothScrollingAnimationComponentProps extends IColumnScrollWidths {
    /**
     * Селекторы горизонтального скролла из контекста.
     */
    selectors: ISelectorsState;
    /**
     * Позиция от которой происходит скроллирование.
     */
    from: number;
    /**
     * Позиция к которой происходит скроллирование.
     */
    to: number;
    /**
     * Функция обратного вызова, вызываемая при завершении или отмене анимации.
     */
    onAnimationEnd?: () => void;
}

/**
 * Компонент, применяющий стили плавной прокрутки скролла.
 * Для применения стилей используется HTML тег style.
 */
export function SmoothScrollingAnimationComponent(
    props: ISmoothScrollingAnimationComponentProps
): React.FunctionComponentElement<ISmoothScrollingAnimationComponentProps> {
    const onAnimationEndPropCallback = React.useRef(props.onAnimationEnd);

    React.useEffect(() => {
        onAnimationEndPropCallback.current = props.onAnimationEnd;
    }, []);

    const defaultAnimation = createAnimation(
        'default',
        props.from,
        props.to,
        DEFAULT_ANIMATION_DURATION
    );
    const rightFixationAnimation = createAnimation(
        'right',
        props.from - getMaxScrollPosition(props),
        props.to - getMaxScrollPosition(props),
        DEFAULT_ANIMATION_DURATION
    );

    const transformedElement = document.querySelector(
        `.${props.selectors.ROOT_TRANSFORMED_ELEMENT}`
    ) as HTMLElement;

    const onAnimationEnd = React.useCallback(() => {
        onAnimationEndPropCallback.current?.();
        transformedElement.removeEventListener('animationend', onAnimationEnd);
        transformedElement.removeEventListener('animationcancel', onAnimationEnd);
    }, []);

    if (props.onAnimationEnd && transformedElement) {
        transformedElement.addEventListener('animationend', onAnimationEnd);
        transformedElement.addEventListener('animationcancel', onAnimationEnd);
    }

    return (
        <style data-qa={QA_SELECTORS.SMOOTH_STYLES_TAG}>
            {`${defaultAnimation.scrollAnimation.keyframe}${defaultAnimation.fixationAnimation.keyframe}${rightFixationAnimation.fixationAnimation.keyframe}` +
                `.${props.selectors.ROOT_TRANSFORMED_ELEMENT} { ${defaultAnimation.scrollAnimation.rule} }` +
                `.${props.selectors.FIXED_ELEMENT} { ${defaultAnimation.fixationAnimation.rule} }` +
                `.${props.selectors.FIXED_TO_RIGHT_EDGE_ELEMENT} { ${rightFixationAnimation.fixationAnimation.rule} }`}
        </style>
    );
}

export const SmoothScrollingAnimationComponentMemo = React.memo(SmoothScrollingAnimationComponent);
export default SmoothScrollingAnimationComponentMemo;
