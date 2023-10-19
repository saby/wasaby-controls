import * as React from 'react';
import { getSelectorsState, ISelectorsProps } from '../common/selectors';
import { detection } from 'Env/Env';
import { EdgeState, TColumnScrollStartPosition, TAutoScrollMode } from '../common/types';
import {
    ColumnScrollContext,
    IColumnScrollContext,
    PrivateContextUserSymbol,
} from './ColumnScrollContext';
import { IColumnScrollWidths } from '../common/interfaces';
import contextReducer from './ContextStateReduser';
import { useHandler } from 'Controls/Hooks/useHandler';
import ResizeObserverContainer, {
    TResizeObserverContainerProps,
} from '../ResizeObserver/ResizeObserverContainer';
import 'css!Controls/columnScrollReact';
import {
    START_FIXED_PART_TARGET_NAME,
    SCROLLABLE_PART_TARGET_NAME,
    VIEWPORT_TARGET_NAME,
    END_FIXED_PART_TARGET_NAME,
} from '../common/ResizerTargetsNames';

const NOTIFY_EDGE_STATE_CHANGED_OFFSET = 100;

export interface IColumnScrollContextProviderProps {
    GUID?: string;
    selectors?: ISelectorsProps;
    children: JSX.Element;
    autoScrollMode: TAutoScrollMode;
    columnScrollStartPosition?: TColumnScrollStartPosition;
    onEdgesStateChanged?: (leftEdgeState: EdgeState, rightEdgeState: EdgeState) => void;
    onPositionChanged?: (position: number) => void;
}

export function ColumnScrollContextProvider(
    props: IColumnScrollContextProviderProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.FunctionComponentElement<IColumnScrollContextProviderProps> {
    const onEdgesStateChangedHandler = useHandler(props.onEdgesStateChanged);
    const onPositionChangedHandler = useHandler(props.onPositionChanged);
    const [context, dispatch] = React.useReducer(contextReducer, {}, () => {
        // Инициализация требуется единожды, при построении.
        const columnScrollStartPosition = props.columnScrollStartPosition || 0;

        return {
            SELECTORS: getSelectorsState(props.selectors, props.GUID || 'GUID'),
            autoScrollMode: props.autoScrollMode || 'none',
            isMobile: detection.isMobilePlatform,
            isMobileScrolling: false,
            isScrollbarDragging: false,

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
            columnScrollStartPosition: props.columnScrollStartPosition || 0,
        };
    });

    React.useLayoutEffect(() => {
        dispatch({
            type: 'setAutoScrollMode',
            value: props.autoScrollMode || 'none',
        });
    }, [props.autoScrollMode]);

    const onResize = React.useCallback<TResizeObserverContainerProps['onResize']>((entries) => {
        const getWidth = (name) => {
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
        (
            target,
            align = 'auto',
            smooth,
            privateContextUserSymbol?: typeof PrivateContextUserSymbol
        ) => {
            dispatch({
                type: 'scrollIntoView',
                target,
                align,
                smooth,
                privateContextUserSymbol,
                onPositionChanged: onPositionChangedHandler,
                onEdgesStateChanged: onEdgesStateChangedHandler,
            });
        },
        []
    );

    const updateSizes = React.useCallback(
        (
            privateContextUserSymbol: typeof PrivateContextUserSymbol,
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

    const contextRefForHandlersOnly = React.useRef<IColumnScrollContext>();

    const contextValue = React.useMemo<IColumnScrollContext>(() => {
        const value = {
            contextRefForHandlersOnly,
            SELECTORS: context.SELECTORS,

            autoScrollMode: context.autoScrollMode,
            isMobile: context.isMobile,
            isNeedByWidth: context.isNeedByWidth,

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
        context.autoScrollMode,
        context.SELECTORS,
        context.isMobile,
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
                {React.cloneElement(props.children as JSX.Element, {
                    forwardedRef: ref,
                })}
            </ColumnScrollContext.Provider>
        </ResizeObserverContainer>
    );
}

export default React.memo(React.forwardRef(ColumnScrollContextProvider));
