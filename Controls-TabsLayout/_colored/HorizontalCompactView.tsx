import TabItem from './TabItem';
import { useState, useRef, useEffect } from 'react';
import { Container as ScrollContainer } from 'Controls/scroll';
import { IColoredOptions } from './IColored';

interface IHorizontalCompactView extends IColoredOptions {
    /*
     * Позволяет ужимать активную вкладку, убирая заголовок и отображая иконку со счётчиком.
     * @default false
     * @demo Controls-TabsLayout-demo/colored/HorizontalCompactView/CompactMode/Index
     */
    compactMode?: boolean;
}

const scrollToBottom = (scrollContainer) => {
    scrollContainer.scrollToBottom();
};

const scrollToTop = (scrollContainer) => {
    scrollContainer.scrollToTop();
};

const isValidItemIndex = (index, items) => {
    return index >= 0 && index <= items.length - 1;
};

/**
 * Горизонтальные компактные вкладки.
 *
 * @class Controls-TabsLayout/_colored/HorizontalCompactView
 * @extends UI/Base:Control
 * @control
 * @public
 * @mixes Controls/interface:ISingleSelectable
 * @implements Controls-TabsLayout/colored:IColoredOptions
 * @demo Controls-TabsLayout-demo/colored/HorizontalCompactView/Index
 *
 */

function HorizontalCompactView(props: IHorizontalCompactView) {
    const [selectedItem, setSelectedItem] = useState(0);
    const [oldScrollState, setOldScrollState] = useState(null);
    const scrollTimer = useRef();
    const updateRef = useRef({});
    const scrollContainerRef = useRef('');

    useEffect(() => {
        setSelectedItem(0);
    }, [props.items]);

    const onClickHandler = (index) => {
        scrollContainerRef.current.scrollToTop();
        setSelectedItem(index);
    };

    const getOffsetClassName = (index) => {
        if (index === selectedItem) {
            return 'controls-ColoredTabs__head-tab_position-center_padding';
        }
        if (index > selectedItem) {
            return 'controls-ColoredTabs__head-tab_position-center_padding-left';
        }
        return 'controls-ColoredTabs__head-tab_position-center_padding-right';
    };

    const getItemZIndex = (index) => {
        if (selectedItem === props.items.length - 1 && index !== selectedItem) {
            return index;
        }
        if (index === selectedItem) {
            return props.items.length + 1;
        }
        return props.items.length - index;
    };

    const setSelectedItemWrapper = (index: number) => {
        if (!scrollTimer.current) {
            setSelectedItem(index);
        }
    };

    const scrollStateChangedHandler = (scrollState) => {
        if (!scrollState.canVerticalScroll) {
            return;
        }
        if (oldScrollState && !updateRef.current.shouldNotUpdate) {
            const newVerticalPosition = scrollState.verticalPosition;
            if (oldScrollState.verticalPosition !== newVerticalPosition) {
                let newSelectedItem;
                if (newVerticalPosition === 'start') {
                    newSelectedItem = selectedItem - 1;
                }
                if (newVerticalPosition === 'end') {
                    newSelectedItem = selectedItem + 1;
                }
                if (newSelectedItem >= 0 && newSelectedItem <= props.items.length - 1) {
                    setSelectedItemWrapper(newSelectedItem);
                    updateRef.current.shouldNotUpdate = true;
                    if (!scrollTimer.current) {
                        scrollTimer.current = setTimeout(() => {
                            scrollTimer.current = null;
                        }, 500);
                        if (newVerticalPosition === 'start') {
                            window.requestAnimationFrame(() => {
                                scrollToBottom(scrollContainerRef.current);
                            });
                        } else {
                            window.requestAnimationFrame(() => {
                                scrollToTop(scrollContainerRef.current);
                            });
                        }
                    }
                }
            } else {
                if (scrollTimer.current) {
                    clearTimeout(scrollTimer.current);
                }
                scrollTimer.current = setTimeout(() => {
                    scrollTimer.current = null;
                }, 500);
            }
        } else {
            updateRef.current.shouldNotUpdate = false;
        }
        setOldScrollState(scrollState);
    };

    const onWheelHandler = (event) => {
        const direction = event.deltaY > 0 ? 'bottom' : 'top';
        if (oldScrollState && oldScrollState.canVerticalScroll) {
            const canScrollBottom = () => {
                return oldScrollState.verticalPosition !== 'end' || direction !== 'bottom';
            };
            const canScrollTop = () => {
                return oldScrollState.verticalPosition !== 'start' || direction !== 'top';
            };

            if (!canScrollBottom() || !canScrollTop()) {
                event.preventDefault();
            } else {
                if (scrollTimer.current) {
                    clearTimeout(scrollTimer.current);
                }
                scrollTimer.current = setTimeout(() => {
                    scrollTimer.current = null;
                }, 500);
            }

            if (!canScrollBottom()) {
                const newSelectedItem = selectedItem + 1;
                if (isValidItemIndex(newSelectedItem, props.items)) {
                    setSelectedItemWrapper(newSelectedItem);
                    if (!scrollTimer.current) {
                        scrollTimer.current = setTimeout(() => {
                            scrollTimer.current = null;
                        }, 500);
                        window.requestAnimationFrame(() => {
                            scrollToTop(scrollContainerRef.current);
                        });
                    }
                }
            }
            if (!canScrollTop()) {
                const newSelectedItem = selectedItem - 1;
                if (isValidItemIndex(newSelectedItem, props.items)) {
                    setSelectedItemWrapper(newSelectedItem);
                    if (!scrollTimer.current) {
                        scrollTimer.current = setTimeout(() => {
                            scrollTimer.current = null;
                        }, 500);
                        window.requestAnimationFrame(() => {
                            scrollToBottom(scrollContainerRef.current);
                        });
                    }
                }
            }
        }
    };

    return (
        <div className={'ColoredTabsHorizontalCompact'}>
            <div className="ColoredTabsHorizontalCompact__tabItems-container">
                {props.items.map((item, index) => {
                    return (
                        <TabItem
                            item={item}
                            key={item.key}
                            attrs={{
                                style: `z-index: ${getItemZIndex(index)}`,
                            }}
                            className={getOffsetClassName(index)}
                            onClick={() => {
                                onClickHandler(index);
                            }}
                            selectedKey={props.items[selectedItem]?.key}
                            isCompact={
                                props.items[selectedItem]?.key !== item.key || props.compactMode
                            }
                            iconViewMode={'visible'}
                            headTemplate={props.headTemplate}
                            headPosition={props.headPosition}
                            position="center"
                        />
                    );
                })}
            </div>
            <ScrollContainer
                attrs={{
                    style: `z-index: ${props.items.length}`,
                }}
                bottomShadowVisibility="hidden"
                ref={scrollContainerRef}
                scrollbarVisible={false}
                onScrollStateChanged={(scrollState) => {
                    scrollStateChangedHandler(scrollState);
                }}
                onWheel={(event) => {
                    onWheelHandler(event);
                }}
                customEvents={['onScrollStateChanged']}
                className={`ColoredTabsHorizontalCompact__content__scroll controls-ColoredTabs__border-${props.items[selectedItem].backgroundStyle}`}
                data-qa={'ColoredTabsHorizontalCompact__content__scroll'}
            >
                <>
                    {props.items.map((item, index) => {
                        if (index === selectedItem) {
                            return (
                                <item.itemTemplate
                                    key={item.key}
                                    className="controls-ColoredTabs__custom-content"
                                />
                            );
                        }
                        return null;
                    })}
                </>
            </ScrollContainer>
        </div>
    );
}

export default HorizontalCompactView;
