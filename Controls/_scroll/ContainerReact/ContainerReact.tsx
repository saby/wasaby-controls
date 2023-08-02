/**
 * @kaizen_zone 7b560386-8131-481a-b9c0-8b3ede6f29a0
 */
import * as React from 'react';
import { delimitProps } from 'UICore/Jsx';
import { _StickyContext, _StickyGroupContext } from 'Controls/stickyBlock';
import { SCROLL_POSITION } from '../Utils/Scroll';
import 'css!Controls/scroll';
import { ScrollContext } from '../Contexts/ScrollContext';
import ArrowButton from '../ArrowButton/ArrowButton';
import Async from 'Controls/Container/Async';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';

interface IScrollbarStyle {
    verticalScrollbarStyles: object;
    horizontalScrollbarStyles: object;
}

function Shadows(props): React.ReactElement {
    return (
        <>
            {props.shadows.top?.isEnabled && !props.isOptimizeShadowEnabled && (
                <div
                    className={`controls-Scroll__shadow ${props.getShadowClasses(
                        'horizontal',
                        'top'
                    )} ${!props.shadows.top.isVisible ? 'ws-invisible' : ''}`}
                    data-qa={'Scroll__shadow_top'}
                ></div>
            )}
            {props.shadows.bottom?.isEnabled && !props.isOptimizeShadowEnabled && (
                <div
                    className={`controls-Scroll__shadow ${props.getShadowClasses(
                        'horizontal',
                        'bottom'
                    )} ${!props.shadows.bottom.isVisible ? 'ws-invisible' : ''}`}
                    data-qa={'Scroll__shadow_bottom'}
                ></div>
            )}
            {props.shadows.left?.isEnabled && props.shadowMode !== 'blur' && (
                <div
                    className={`controls-Scroll__shadow ${props.getShadowClasses(
                        'vertical',
                        'left'
                    )} ${!props.shadows.left.isVisible ? 'ws-invisible' : ''}`}
                    data-qa={'Scroll__shadow_left'}
                ></div>
            )}
            {props.shadows.right?.isEnabled && props.shadowMode !== 'blur' && (
                <div
                    className={`controls-Scroll__shadow ${props.getShadowClasses(
                        'vertical',
                        'right'
                    )} ${!props.shadows.right.isVisible ? 'ws-invisible' : ''}`}
                    data-qa={'Scroll__shadow_right'}
                ></div>
            )}
        </>
    );
}

function Arrows(props): React.ReactElement {
    return (
        <>
            {props.arrowButtons && props.arrowButtons.isTopVisible && (
                <ArrowButton
                    orientation="vertical"
                    direction={'up'}
                    className={
                        props.buttonsMode === 'hover' ? 'controls-scroll_scrollButton__hovered' : ''
                    }
                    onClick={props.handleArrowButton}
                />
            )}
            {props.arrowButtons && props.arrowButtons.isBottomVisible && (
                <ArrowButton
                    orientation="vertical"
                    direction={'down'}
                    className={
                        props.buttonsMode === 'hover' ? 'controls-scroll_scrollButton__hovered' : ''
                    }
                    onClick={props.handleArrowButton}
                />
            )}
            {props.arrowButtons && props.arrowButtons.isLeftVisible && (
                <ArrowButton
                    orientation="horizontal"
                    direction={'prev'}
                    className={
                        props.buttonsMode === 'hover' ? 'controls-scroll_scrollButton__hovered' : ''
                    }
                    onClick={props.handleArrowButton}
                />
            )}
            {props.arrowButtons && props.arrowButtons.isRightVisible && (
                <ArrowButton
                    orientation="horizontal"
                    direction={'next'}
                    className={
                        props.buttonsMode === 'hover' ? 'controls-scroll_scrollButton__hovered' : ''
                    }
                    onClick={props.handleArrowButton}
                />
            )}
        </>
    );
}

function Scrollbars(props, style: IScrollbarStyle): React.ReactElement {
    return (
        props.scrollbars?.isVisible && (
            <>
                {props.scrollbars.vertical?.isVisible && (
                    <Async
                        templateName={'Controls/scrollbar:Scrollbar'}
                        templateOptions={{
                            className: `controls-Scroll__scrollbar ${
                                !props.dragging ? 'controls-Scroll__scrollbar_hidden' : ''
                            }`,
                            style: style.verticalScrollbarStyles,
                            position: props.scrollbars.vertical.position,
                            contentSize: props.scrollbars.vertical.contentSize,
                            paddings: props.verticalScrollbarPaddings,
                            onPositionchanged: props.scrollbarPositionChangedHandler,
                            onDraggingchanged: props.scrollbarDraggingChangedHandler,
                        }}
                    />
                )}

                {props.scrollbars.horizontal?.isVisible && (
                    <Async
                        templateName={'Controls/scrollbar:Scrollbar'}
                        templateOptions={{
                            className: `controls-Scroll__scrollbar ${
                                !props.dragging ? 'controls-Scroll__scrollbar_hidden' : ''
                            }`,
                            style: style.horizontalScrollbarStyles,
                            position: props.scrollbars.horizontal.position,
                            contentSize: props.scrollbars.horizontal.contentSize,
                            direction: 'horizontal',
                            paddings: props.horizontalScrollbarPaddings,
                            hasOppositeScrollbar: props.scrollbars.vertical?.isVisible,
                            onPositionchanged: props.scrollbarPositionChangedHandler,
                            onDraggingchanged: props.scrollbarDraggingChangedHandler,
                        }}
                    />
                )}
            </>
        )
    );
}

function ContainerReact(props, ref): React.ReactElement {
    const { clearProps, userAttrs } = delimitProps(props);
    const scrollContext = React.useContext(ScrollContext);
    const [_, forceUpdate] = React.useReducer((x) => {
        return x + 1;
    }, 0);
    const stickyModelsContext = React.useRef({});
    const stickyGroupModelsContext = React.useRef<{
        scrollState?: {
            scrollTop: number;
            horizontalPosition: string;
            horizontalScrollMode: string;
        };
    }>({});
    React.useEffect(() => {
        if (props.getContextValue) {
            props.getContextValue(scrollContext?.pagingVisible);
        }
    }, [scrollContext]);
    const updateContext = (stickyModels, groupModels, scrollModel, needRerender = true) => {
        const stickyContextModels = { ...stickyModels, models: {} };
        for (const id in stickyModels.models) {
            if (stickyModels.models.hasOwnProperty(id)) {
                stickyContextModels.models[id] = { ...stickyModels.models[id] };
            }
        }
        stickyModelsContext.current = stickyContextModels;
        let newScrollState = {
            scrollTop: scrollModel?._scrollTop || 0,
            horizontalPosition: scrollModel?._horizontalPosition || SCROLL_POSITION.START,
            horizontalScrollMode: scrollModel?.horizontalScrollMode || 'default',
        };
        if (
            JSON.stringify(stickyGroupModelsContext.current.scrollState) ===
            JSON.stringify(newScrollState)
        ) {
            newScrollState = stickyGroupModelsContext.current.scrollState;
        }
        stickyGroupModelsContext.current = { ...groupModels, scrollState: newScrollState };
        if (needRerender) {
            forceUpdate();
        }
    };
    props.setStickyContextUpdater(updateContext);
    if (!Object.keys(stickyModelsContext.current).length) {
        updateContext(
            clearProps.stickyModels,
            clearProps.stickyGroupModels,
            { horizontalScrollMode: props.horizontalScrollMode },
            false
        );
    }
    const verticalScrollbarStyles =
        wasabyAttrsToReactDom({ style: props.scrollbars?.vertical?.style })?.style || {};
    const horizontalScrollbarStyles =
        wasabyAttrsToReactDom({ style: props.scrollbars?.horizontal?.style })?.style || {};
    return (
        <_StickyContext.Provider value={stickyModelsContext.current}>
            <_StickyGroupContext.Provider value={stickyGroupModelsContext.current}>
                <>
                    {clearProps.content.isWasabyTemplate ? (
                        <clearProps.content forwardedRef={ref} {...userAttrs} />
                    ) : (
                        React.cloneElement(clearProps.content, { ...userAttrs, forwardedRef: ref })
                    )}
                    {Shadows(props)}
                    {Arrows(props)}
                    {Scrollbars(props, { verticalScrollbarStyles, horizontalScrollbarStyles })}
                </>
            </_StickyGroupContext.Provider>
        </_StickyContext.Provider>
    );
}

export default React.memo(React.forwardRef(ContainerReact));
