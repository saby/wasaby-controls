/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import * as React from 'react';
import { detection } from 'Env/Env';
import { getSelectorsState, TSelectorsProps } from '../common/selectors';
import {
    END_FIXED_PART_TARGET_NAME,
    SCROLLABLE_PART_TARGET_NAME,
    START_FIXED_PART_TARGET_NAME,
    VIEWPORT_TARGET_NAME,
} from '../common/ResizerTargetsNames';
import {
    EdgeState,
    TAutoScrollAnimation,
    TColumnScrollStartPosition,
    TAutoScrollMode,
    IScrollIntoViewActionParams,
} from '../common/types';
import { IColumnScrollWidths } from '../common/interfaces';
import {
    ColumnScrollContext,
    IColumnScrollContext,
    PrivateContextUserSymbol,
} from './ColumnScrollContext';
import contextReducer from './ContextStateReducer';
import { useHandler } from 'Controls/Hooks/useHandler';
import { Container as ResizeObserverContainer, TOnResizeHandler } from 'Controls/resizeObserver';
import 'css!Controls/columnScrollReact';

/**
 * Отступ триггеров от краев контента.
 */
// Не реализовано
// TODO: Реализовать
const NOTIFY_EDGE_STATE_CHANGED_OFFSET = 0;

/**
 * Опции компонента ColumnScrollContextProvider.
 */
export interface IColumnScrollContextProviderProps {
    /**
     * Уникальный, в рамках приложения, идентификатор скролла.
     */
    GUID?: string;
    /**
     * CSS селекторы различных элементов внутри скроллируемой области.
     */
    selectors?: TSelectorsProps;
    children: React.JSX.Element;
    /**
     * Анимация автоподскрола при завершении скроллирования.
     */
    autoScrollAnimation: TAutoScrollAnimation;
    /**
     * Метод определнения элемента для подскролла по позиции.
     */
    autoScrollMode: TAutoScrollMode;
    /**
     * Начальная позиция скролла.
     */
    columnScrollStartPosition?: TColumnScrollStartPosition;
    /**
     * Функция обратного вызова, уведомляющая о смене состояния границ скроллируемой области.
     */
    onEdgesStateChanged?: (leftEdgeState: EdgeState, rightEdgeState: EdgeState) => void;
    /**
     * Функция обратного вызова, уведомляющая о смене позиции скролла.
     */
    onPositionChanged?: (position: number) => void;
}

/**
 * Провайдер контекста скролла.
 */
export function ColumnScrollContextProvider(
    props: IColumnScrollContextProviderProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.FunctionComponentElement<IColumnScrollContextProviderProps> {
    const onEdgesStateChangedHandler = useHandler(props.onEdgesStateChanged || (() => {}));
    const onPositionChangedHandler = useHandler(props.onPositionChanged || (() => {}));
    const [context, dispatch] = React.useReducer(contextReducer, {}, (args) => {
        // Инициализация требуется единожды, при построении.
        const columnScrollStartPosition = props.columnScrollStartPosition || 0;

        return {
            ...args,
            SELECTORS: getSelectorsState(props.selectors, props.GUID || 'GUID'),
            autoScrollAnimation: props.autoScrollAnimation || 'none',
            autoScrollMode: props.autoScrollMode || 'closest',
            isMobile: detection.isMobilePlatform,
            isMobileScrolling: false,
            isScrollbarDragging: false,
            isInitializedSizes: false,

            viewPortWidth: 0,
            startFixedWidth: 0,
            endFixedWidth: 0,
            contentWidth: 0,
            mobileSmoothedScrollPosition: undefined,

            previousAppliedPosition: null,
            position: typeof columnScrollStartPosition === 'number' ? columnScrollStartPosition : 0,
            leftEdgeState:
                typeof columnScrollStartPosition === 'number' && columnScrollStartPosition > 0
                    ? EdgeState.Invisible
                    : EdgeState.Visible,
            rightEdgeState: EdgeState.Visible,
            leftTriggerEdgeState:
                typeof columnScrollStartPosition === 'number' &&
                columnScrollStartPosition > NOTIFY_EDGE_STATE_CHANGED_OFFSET
                    ? EdgeState.Invisible
                    : EdgeState.Visible,
            rightTriggerEdgeState: EdgeState.Visible,
            isNeedByWidth: false,
            columnScrollStartPosition,
        };
    });

    React.useLayoutEffect(() => {
        dispatch({
            type: 'setAutoScrollAnimation',
            value: props.autoScrollAnimation || 'none',
        });
    }, [props.autoScrollAnimation]);

    const onResize = React.useCallback<TOnResizeHandler>((entries) => {
        const getWidth = (name: Symbol) => {
            const entry = entries.find((e) => e.name === name)?.entry;
            if (entry) {
                return entry.borderBoxSize
                    ? entry.borderBoxSize[0].inlineSize
                    : entry.contentRect.width;
            }
        };

        dispatch({
            type: 'internalUpdateSizes',
            viewPortWidth: getWidth(VIEWPORT_TARGET_NAME),
            startFixedWidth: getWidth(START_FIXED_PART_TARGET_NAME),
            endFixedWidth: getWidth(END_FIXED_PART_TARGET_NAME),
            scrollableWidth: getWidth(SCROLLABLE_PART_TARGET_NAME),
            onPositionChanged: onPositionChangedHandler,
            onEdgesStateChanged: onEdgesStateChangedHandler,
        });
    }, []);

    const setIsMobileScrolling = React.useCallback<IColumnScrollContext['setIsMobileScrolling']>(
        (value) => {
            dispatch({
                type: 'setIsMobileScrolling',
                value,
            });
        },
        []
    );

    const setIsScrollbarDragging = React.useCallback<
        IColumnScrollContext['setIsScrollbarDragging']
    >((value) => {
        dispatch({
            type: 'setIsScrollbarDragging',
            value,
            onPositionChanged: onPositionChangedHandler,
            onEdgesStateChanged: onEdgesStateChangedHandler,
        });
    }, []);

    const scrollIntoView = React.useCallback<IColumnScrollContext['scrollIntoView']>(
        (target: Element | number, params?: IScrollIntoViewActionParams) => {
            dispatch({
                type: 'scrollIntoView',
                target,
                align: params?.align || 'auto',
                autoScrollAnimation: params?.autoScrollAnimation,
                autoScrollMode: params?.autoScrollMode || 'closest',
                privateContextUserSymbol: params?.privateContextUserSymbol,
                onPositionChanged: onPositionChangedHandler,
                onEdgesStateChanged: onEdgesStateChangedHandler,
            });
        },
        []
    );

    const updateSizes = React.useCallback(
        (
            privateContextUserSymbol: typeof PrivateContextUserSymbol | null,
            widths: Partial<IColumnScrollWidths>
        ) => {
            dispatch({
                type: 'updateSizes',
                widths,
                privateContextUserSymbol,
                onPositionChanged: onPositionChangedHandler,
                onEdgesStateChanged: onEdgesStateChangedHandler,
            });
        },
        []
    );

    const setPosition = React.useCallback(
        (
            newPosition: number,
            smooth?: boolean,
            privateContextUserSymbol?: typeof PrivateContextUserSymbol
        ) => {
            dispatch({
                type: 'setPosition',
                position: newPosition,
                smooth,
                privateContextUserSymbol,
                onPositionChanged: onPositionChangedHandler,
                onEdgesStateChanged: onEdgesStateChangedHandler,
            });
        },
        []
    );

    const contextRefForHandlersOnly = React.useRef<IColumnScrollContext>(
        undefined as unknown as IColumnScrollContext
    );

    const contextValue = React.useMemo<IColumnScrollContext>(() => {
        const value = {
            contextRefForHandlersOnly,
            SELECTORS: context.SELECTORS,

            autoScrollAnimation: context.autoScrollAnimation,
            autoScrollMode: context.autoScrollMode,
            isMobile: context.isMobile,
            isNeedByWidth: context.isNeedByWidth,
            isInitializedSizes: context.isInitializedSizes,

            position: context.position,

            leftEdgeState: context.leftEdgeState,
            rightEdgeState: context.rightEdgeState,

            isMobileScrolling: context.isMobileScrolling,
            isScrollbarDragging: context.isScrollbarDragging,
            mobileSmoothedScrollPosition: context.mobileSmoothedScrollPosition,

            viewPortWidth: context.viewPortWidth,
            contentWidth: context.contentWidth,
            startFixedWidth: context.startFixedWidth,
            endFixedWidth: context.endFixedWidth,

            updateSizes,
            scrollIntoView,
            setPosition,
            setIsMobileScrolling,
            setIsScrollbarDragging,
        };

        contextRefForHandlersOnly.current = value;

        return value;
    }, [
        context.autoScrollAnimation,
        context.autoScrollMode,
        context.SELECTORS,
        context.isMobile,
        context.isInitializedSizes,
        context.isNeedByWidth,
        context.position,
        context.leftEdgeState,
        context.rightEdgeState,
        context.isMobileScrolling,
        context.isScrollbarDragging,
        context.mobileSmoothedScrollPosition,
        context.viewPortWidth,
        context.contentWidth,
        context.startFixedWidth,
        context.endFixedWidth,
        updateSizes,
        setPosition,
        setIsMobileScrolling,
    ]);

    // TODO: Удалить когда либа листа перейдет на реакт.
    //  Такой проброс элемента нужен когда провайдер вставляется в wasaby окружение.
    //  В таком случае необходимо прокинуть ссылку до ближайшего div.
    //  Т.к. у провайдера нет вёрстки, навешивает ref первый ребенок с вёрсткой.
    //  Провайдер обязан лишь не прервать эту связь.
    return (
        <ResizeObserverContainer onResize={onResize}>
            <ColumnScrollContext.Provider value={contextValue}>
                {React.cloneElement(props.children as React.JSX.Element, {
                    forwardedRef: ref,
                })}
            </ColumnScrollContext.Provider>
        </ResizeObserverContainer>
    );
}

export default React.memo(React.forwardRef(ColumnScrollContextProvider));
