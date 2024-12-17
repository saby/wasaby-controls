/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import * as React from 'react';
import { ColumnScrollContext, PrivateContextUserSymbol } from './context/ColumnScrollContext';
import ArrowButtonsNavigationComponent from './Navigation/ArrowButtons';
import ScrollbarNavigationComponent, {
    IScrollbarNavigationComponentProps,
} from './Navigation/Scrollbar';
import {
    getPrevPagePosition,
    getNextPagePosition,
    isEdgeVisibleOrAnimated,
} from './common/helpers';
import type { TArrowButtonButtonStyle } from 'Controls/extButtons';

/**
 * Опции компонента NavigationComponent.
 */
export interface INavigationComponentProps
    extends Pick<IScrollbarNavigationComponentProps, 'scrollBarValign'> {
    mode?: 'arrows' | 'scrollbar';
    className?: string;
    columnScrollArrowButtonsStyle?: TArrowButtonButtonStyle;
}

/**
 * Компонент, отображающий навигацию скролла.
 * Может отображаться платформенный скроллбар, кнопки стрелки для плавного листания или ничего.
 *
 */
export function NavigationComponent(
    props: INavigationComponentProps
): React.FunctionComponentElement<INavigationComponentProps> | null {
    // Контекст сохраняется в ref для избежания лишних перерисовок контролов, не зависящих от позиции.
    // Подробнее описано ниже, в выводе ArrowButtonsNavigationComponent.
    // При этом, данный компонент точно будет перерисован при изменении контекста и это правильно.
    const context = React.useContext(ColumnScrollContext);

    // Мемоизированный обработчик нажатия кнопки, отвязан явно от контекста, чтобы не перерисовывался
    // ArrowButtonsNavigationComponent. Актуальные стейты берет из контекста, сохраненного на ref.
    // Компонент кнопок должен перерисовываться только когда произошло скролирование к границе или от нее.
    // В такие моменты происходит изменение доступности кнопок(readOnly), например, находясь в начале,
    // нельзя скролить влево. Чтобы обеспечить отсутствие перерисовок при изменении позиции,
    // при этом иметь актуальную позицию в обработчике нажатия на кнопку, контекст кладется в ref,
    // а обработчик мемоизируется.
    const onArrowClick = React.useCallback((direction: 'backward' | 'forward') => {
        const ctx = context.contextRefForHandlersOnly.current;

        const newPosition =
            direction === 'backward'
                ? getPrevPagePosition(ctx.position, ctx)
                : getNextPagePosition(ctx.position, ctx);

        if (ctx.autoScrollAnimation !== 'none') {
            ctx.scrollIntoView(newPosition, {
                align: 'auto',
                autoScrollAnimation: 'smooth',
                autoScrollMode: ctx.autoScrollMode,
                privateContextUserSymbol: PrivateContextUserSymbol,
            });
        } else {
            context.setPosition(newPosition, true, PrivateContextUserSymbol);
        }
    }, []);

    const onDraggingChangeCallback = React.useCallback<
        Required<IScrollbarNavigationComponentProps>['onDraggingChangeCallback']
    >((isDragging) => {
        if (!context.contextRefForHandlersOnly.current.isMobile) {
            const ctx = context.contextRefForHandlersOnly.current;

            ctx.setIsScrollbarDragging(isDragging);

            if (!isDragging && ctx.autoScrollAnimation !== 'none') {
                ctx.scrollIntoView(ctx.position, {
                    align: 'auto',
                    autoScrollAnimation: ctx.autoScrollAnimation,
                    autoScrollMode: ctx.autoScrollMode,
                });
            }
        }
    }, []);

    let className = context.SELECTORS.NOT_DRAG_SCROLLABLE;

    if (props.className) {
        className += ` ${props.className}`;
    }

    if (props.mode === 'arrows') {
        if (!context.isNeedByWidth) {
            return null;
        }

        // Кнопки не видны когда граница в данном направлении видна или идет анимация скрола к/от неё.
        // При скроле к границе кнопку необходимо отключать незамедлительно, чтобы во время анимации пользователь
        // не мог нажать на нее.
        return (
            <ArrowButtonsNavigationComponent
                isLeftEnabled={!isEdgeVisibleOrAnimated(context.leftEdgeState)}
                isRightEnabled={!isEdgeVisibleOrAnimated(context.rightEdgeState)}
                arrowButtonsStyle={props.columnScrollArrowButtonsStyle}
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
                readOnly={context.isMobile}
                position={context.position}
                onPositionChangeCallback={context.setPosition}
                onDraggingChangeCallback={onDraggingChangeCallback}
                className={className}
                viewPortWidth={context.viewPortWidth}
                contentWidth={context.contentWidth}
                startFixedWidth={context.startFixedWidth}
                endFixedWidth={context.endFixedWidth}
                scrollBarValign={props.scrollBarValign}
            />
        );
    }
}

export default React.memo(NavigationComponent);
