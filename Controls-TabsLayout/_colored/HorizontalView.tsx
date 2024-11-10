import TabItem from 'Controls-TabsLayout/_colored/TabItem';
import { Container as ScrollContainer } from 'Controls/scroll';
import { useState, useRef, useEffect } from 'react';
import { IColoredOptions } from './IColored';

interface IHorizontalView extends IColoredOptions {
    width: number;
    activeTabWidth: number;
}

const getInactiveItemVisibleWidth = (activeWidth: number, width: number, itemsLength) => {
    return (width - activeWidth) / (itemsLength - 1);
};

const calculatePosition = (items, itemIndex, activeWidth, width, selectedItem = 0) => {
    let position = 0;
    items.forEach((item, index) => {
        if (index >= itemIndex) {
            return;
        }
        if (selectedItem === index) {
            position += activeWidth;
        } else {
            position += getInactiveItemVisibleWidth(activeWidth, width, items.length);
        }
    });
    return position;
};

const isValidItemIndex = (index, items) => {
    return index >= 0 && index <= items.length - 1;
};

/**
 * Горизонтальные вкладки.
 *
 * @class Controls-TabsLayout/_colored/HorizontalView
 * @extends UI/Base:Control
 * @control
 * @public
 * @mixes Controls/interface:ISingleSelectable
 * @implements Controls-TabsLayout/colored:IColoredOptions
 * @demo Controls-TabsLayout-demo/colored/HorizontalView/Index
 *
 */

function HorizontalView(props: IHorizontalView) {
    const [selectedItem, setSelectedItem] = useState(0);
    const scrollContainersStates = useRef({});

    useEffect(() => {
        setSelectedItem(0);
    }, [props.items]);

    let scrollTimer: number;
    const tabClickHandler = (index: number) => {
        setSelectedItemWrapper(index);
    };

    const setSelectedItemWrapper = (index: number) => {
        if (!scrollTimer) {
            setSelectedItem(index);
        }
    };

    const scrollStateChangedHandler = (scrollState, index) => {
        const oldScrollState = scrollContainersStates.current[index];
        if (oldScrollState) {
            const newVerticalPosition = scrollState.verticalPosition;
            if (oldScrollState.verticalPosition !== newVerticalPosition) {
                let newSelectedItem;
                if (newVerticalPosition === 'start') {
                    newSelectedItem = selectedItem - 1;
                }
                if (newVerticalPosition === 'end') {
                    newSelectedItem = selectedItem + 1;
                }
                if (newSelectedItem > 0 && newSelectedItem < props.items.length - 1) {
                    setSelectedItemWrapper(newSelectedItem);
                }
            } else {
                if (scrollTimer) {
                    clearTimeout(scrollTimer);
                }
                scrollTimer = setTimeout(() => {
                    scrollTimer = null;
                }, 500);
            }
        }
        scrollContainersStates.current[index] = scrollState;
    };

    const onWheelHandler = (event, index) => {
        const direction = event.deltaY > 0 ? 'bottom' : 'top';
        const scrollState = scrollContainersStates.current[index];
        if (scrollState.canVerticalScroll) {
            const canScrollBottom = () => {
                return scrollState.verticalPosition !== 'end' || direction !== 'bottom';
            };
            const canScrollTop = () => {
                return scrollState.verticalPosition !== 'start' || direction !== 'top';
            };

            if (!canScrollBottom() || !canScrollTop()) {
                event.preventDefault();
            } else {
                if (scrollTimer) {
                    clearTimeout(scrollTimer);
                }
                scrollTimer = setTimeout(() => {
                    scrollTimer = null;
                }, 500);
            }

            if (index !== selectedItem) {
                if (
                    (scrollState.verticalPosition !== 'end' || direction !== 'bottom') &&
                    (scrollState.verticalPosition !== 'start' || direction !== 'top')
                ) {
                    setSelectedItemWrapper(index);
                }
            }
            if (index === selectedItem) {
                if (!canScrollBottom()) {
                    const newSelectedItem = index + 1;
                    if (isValidItemIndex(newSelectedItem, props.items)) {
                        setSelectedItemWrapper(newSelectedItem);
                    }
                }
                if (!canScrollTop()) {
                    const newSelectedItem = index - 1;
                    if (isValidItemIndex(newSelectedItem, props.items)) {
                        setSelectedItemWrapper(newSelectedItem);
                    }
                }
            }
        } else {
            if (index === selectedItem) {
                const delta = direction === 'top' ? -1 : 1;
                const newSelectedItem = index + delta;
                if (isValidItemIndex(newSelectedItem, props.items)) {
                    setSelectedItemWrapper(newSelectedItem);
                }
            }
            event.preventDefault();
        }
    };

    return (
        <div className="ColoredTabsHorizontal">
            <div className="ColoredTabsHorizontal__shadow-blur"></div>
            {props.items.map((item, index) => {
                const position = calculatePosition(
                    props.items,
                    index,
                    props.activeTabWidth,
                    props.width,
                    selectedItem
                );
                return (
                    <div
                        className="ColoredTabsHorizontal__item-container"
                        style={{
                            left: `${position}px`,
                            width: `${props.activeTabWidth}px`,
                        }}
                    >
                        <div className="ColoredTabsHorizontal__tab-item__container">
                            <TabItem
                                headTemplate={props.headTemplate}
                                headPosition={props.headPosition}
                                onClick={() => {
                                    tabClickHandler(index);
                                }}
                                position="left"
                                selectedKey={props.items[selectedItem]?.key}
                                item={item}
                            />
                        </div>
                        <div
                            className={`ColoredTabsHorizontal__content controls-ColoredTabs__border-${item.backgroundStyle}`}
                        >
                            <ScrollContainer
                                onScrollStateChanged={(scrollState) => {
                                    scrollStateChangedHandler(scrollState, index);
                                }}
                                onWheel={(event) => {
                                    onWheelHandler(event, index);
                                }}
                                customEvents={['onScrollStateChanged']}
                                scrollbarVisible={false}
                                className="ColoredTabsHorizontal__content__scroll"
                            >
                                <item.itemTemplate />
                            </ScrollContainer>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default HorizontalView;

/**
 * @name Controls-TabsLayout/_colored/HorizontalView#width
 * @cfg {Number} Ширина компонента.
 * @remark
 * Требуется для синхронного построения компонента.
 */

/**
 * @name Controls-TabsLayout/_colored/HorizontalView#activeTabWidth
 * @cfg {Number} Ширина активной вкладки.
 */
