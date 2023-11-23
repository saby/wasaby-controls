/**
 * @kaizen_zone 7b560386-8131-481a-b9c0-8b3ede6f29a0
 */
import * as React from 'react';
import { delimitProps, wasabyAttrsToReactDom } from 'UICore/Jsx';
import { _StickyContext, _StickyGroupContext } from 'Controls/stickyBlock';
import { SCROLL_POSITION } from '../Utils/Scroll';
import 'css!Controls/scroll';
import { ScrollContext } from '../Contexts/ScrollContext';
import Async from 'Controls/Container/Async';

interface IScrollbarStyle {
    verticalScrollbarStyles: object;
    horizontalScrollbarStyles: object;
}

function Shadows(props): React.ReactElement {
    let style;
    if (props.offsetTop) {
        style = {
            top: props.offsetTop
        };
    }
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
                    style={style}
                    data-qa={'Scroll__shadow_left'}
                ></div>
            )}
            {props.shadows.right?.isEnabled && props.shadowMode !== 'blur' && (
                <div
                    className={`controls-Scroll__shadow ${props.getShadowClasses(
                        'vertical',
                        'right'
                    )} ${!props.shadows.right.isVisible ? 'ws-invisible' : ''}`}
                    style={style}
                    data-qa={'Scroll__shadow_right'}
                ></div>
            )}
        </>
    );
}

function AsyncButtonTemplate (props) {
    const direction = props.direction;
    const orientation = direction === 'up' || direction === 'down' ? 'vertical' : 'horizontal';
    const type = direction === 'down' || direction === 'right' ? 'next' : 'prev';

    const getArrowClassName = () => {
        return `controls-ArrowButton_stretched_scroll controls-ArrowButton_stretched_scroll_direction-${direction} ` +
            `controls-ArrowButton_stretched_scroll-${orientation}` +
            `${props.buttonsMode === 'hover' ? ' controls-scroll_scrollButton__hovered' : ''}`;
    };
    return (
        <Async
            templateName='Controls/extButtons:ArrowButton'
            templateOptions={{
                direction,
                viewMode: 'stretched',
                iconSize: 'm',
                translucent: 'dark',
                inlineHeight: 'm',
                className: getArrowClassName(),
                'data-qa': `controls_Scroll__ArrowButton_direction_${orientation === 'horizontal' ? type : direction}`,
                onClick: () => props.handleArrowButton(type, orientation)
        }} />
    );
};

function Arrows(props): React.ReactElement {
    return (
        <>
            {props.arrowButtons && props.arrowButtons.isTopVisible &&
                <AsyncButtonTemplate handleArrowButton={props.handleArrowButton}
                                     buttonsMode={props.buttonsMode}
                                     direction='up'/>}
            {props.arrowButtons && props.arrowButtons.isBottomVisible &&
                <AsyncButtonTemplate handleArrowButton={props.handleArrowButton}
                                     buttonsMode={props.buttonsMode}
                                     direction='down'/>}
            {props.arrowButtons && props.arrowButtons.isLeftVisible &&
                <AsyncButtonTemplate handleArrowButton={props.handleArrowButton}
                                     buttonsMode={props.buttonsMode}
                                     direction='left'/>}
            {props.arrowButtons && props.arrowButtons.isRightVisible &&
                <AsyncButtonTemplate handleArrowButton={props.handleArrowButton}
                                     buttonsMode={props.buttonsMode}
                                     direction='right'/>}
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
                            onPositionChanged: props.scrollbarPositionChangedHandler,
                            onDraggingChanged: props.scrollbarDraggingChangedHandler,
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
                            onPositionChanged: props.scrollbarPositionChangedHandler,
                            onDraggingChanged: props.scrollbarDraggingChangedHandler,
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

    if (props.offsetTop) {
        verticalScrollbarStyles.top = props.offsetTop;
    }
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
