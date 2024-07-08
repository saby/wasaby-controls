import TabItem from './TabItem';
import { useState, useRef } from 'react';
import { Container as ScrollContainer } from 'Controls/scroll';
import { debounce } from 'Types/function';
import { IColoredOptions } from './IColored';

interface IHorizontalCompactView extends IColoredOptions {}

const scrollToBottom = (scrollContainer) => {
    scrollContainer.scrollToBottom();
};

const scrollToTop = (scrollContainer) => {
    scrollContainer.scrollToTop();
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
    const updateRef = useRef({});
    const scrollContainerRef = useRef('');
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
                    setSelectedItem(newSelectedItem);
                    updateRef.current.shouldNotUpdate = true;
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
            updateRef.current.shouldNotUpdate = false;
        }
        setOldScrollState(scrollState);
    };

    return (
        <div className={'ColoredTabsHorizontalCompact'}>
            <div className="ColoredTabsHorizontalCompact__tabItems-container">
                {props.items.map((item, index) => {
                    return (
                        <TabItem
                            item={item}
                            attrs={{
                                style: `z-index: ${getItemZIndex(index)}`,
                            }}
                            className={getOffsetClassName(index)}
                            onClick={() => {
                                onClickHandler(index);
                            }}
                            selectedKey={props.items[selectedItem].key}
                            isCompact={props.items[selectedItem].key !== item.key}
                            iconViewMode={'visible'}
                            headTemplate={props.headTemplate}
                            headPosition={props.headPosition}
                            position="center"
                        />
                    );
                })}
            </div>
            <ScrollContainer
                bottomShadowVisibility="hidden"
                ref={scrollContainerRef}
                scrollbarVisible={false}
                onScrollStateChanged={(scrollState) => {
                    scrollStateChangedHandler(scrollState);
                }}
                customEvents={['onScrollStateChanged']}
                className={`ColoredTabsHorizontalCompact__content__scroll controls-ColoredTabs__border-${props.items[selectedItem].backgroundStyle}`}
            >
                <>
                    {props.items.map((item, index) => {
                        if (index === selectedItem) {
                            return <item.itemTemplate />;
                        }
                        return null;
                    })}
                </>
            </ScrollContainer>
        </div>
    );
}

export default HorizontalCompactView;
