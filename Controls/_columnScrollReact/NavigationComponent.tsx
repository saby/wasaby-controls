import * as React from 'react';
import { ColumnScrollContext } from './context/ColumnScrollContext';
import ArrowButtonsNavigationComponent from './Navigation/ArrowButtons';
import ScrollbarNavigationComponent from './Navigation/Scrollbar';
import {
    getPrevPagePosition,
    getNextPagePosition,
    isEdgeVisibleOrAnimated,
} from './common/helpers';

export interface INavigationComponentProps {
    mode?: 'arrows' | 'scrollbar';
}

export function NavigationComponent(
    props: INavigationComponentProps
): React.FunctionComponentElement<INavigationComponentProps> {
    // Контекст сохраняется в ref для избежания лишних перерисовок контролов, не зависящих от позиции.
    // Подробнее описано ниже, в выводе ArrowButtonsNavigationComponent.
    // При этом, данный компонент точно будет перерисован при изменении контекста и это правильно.
    const context = React.useContext(ColumnScrollContext);
    const contextRef = context.contextRefForHandlersOnly;

    // Мемоизированный обработчик нажатия кнопки, отвязан явно от контекста, чтобы не перерисовывался
    // ArrowButtonsNavigationComponent. Актуальные стейты берет из контекста, сохраненного на ref.
    // Компонент кнопок должен перерисовываться только когда произошло скролирование к границе или от нее.
    // В такие моменты происходит изменение доступности кнопок(readOnly), например, находясь в начале,
    // нельзя скролить влево. Чтобы обеспечить отсутствие перерисовок при изменении позиции,
    // при этом иметь актуальную позицию в обработчике нажатия на кнопку, контекст кладется в ref,
    // а обработчик мемоизируется.
    const onArrowClick = React.useCallback(
        (direction: 'backward' | 'forward') => {
            const newPosition =
                direction === 'backward'
                    ? getPrevPagePosition(
                          contextRef.current.position,
                          contextRef.current
                      )
                    : getNextPagePosition(
                          contextRef.current.position,
                          contextRef.current
                      );

            contextRef.current.setPosition(newPosition, true);
        },
        []
    );

    if (props.mode === 'arrows') {
        let className = context.SELECTORS.NOT_DRAG_SCROLLABLE;
        if (!context.isNeedByWidth) {
            className += ' tw-invisible';
        }

        // Кнопки не видны когда граница в данном направлении видна или идет анимация скрола к/от неё.
        // При скроле к границе кнопку необходимо отключать незамедлительно, чтобы во время анимации пользователь
        // не мог нажать на нее.
        return (
            <ArrowButtonsNavigationComponent
                isLeftEnabled={!isEdgeVisibleOrAnimated(context.leftEdgeState)}
                isRightEnabled={
                    !isEdgeVisibleOrAnimated(context.rightEdgeState)
                }
                onArrowClick={onArrowClick}
                className={className}
            />
        );
    } else {
        if (!context.isNeedByWidth) {
            return null;
        }

        // Скролбар зависит от позиции и перерисовывается всегда.
        return (
            <ScrollbarNavigationComponent
                position={context.position}
                onPositionChangeCallback={context.setPosition}
                className={context.SELECTORS.NOT_DRAG_SCROLLABLE}
                viewPortWidth={context.viewPortWidth}
                contentWidth={context.contentWidth}
                fixedWidth={context.fixedWidth}
            />
        );
    }
}

export default React.memo(NavigationComponent);
