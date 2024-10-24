import {
    forwardRef,
    LegacyRef,
    useRef,
    useCallback,
    SyntheticEvent,
    useEffect,
    useMemo,
} from 'react';
import { Control, IChipsOptions } from 'Controls/Chips';
import { Container, IScrollState, SCROLL_MODE, SHADOW_MODE } from 'Controls/scroll';
import { Selector } from 'Controls/dropdown';
import { ItemTemplate } from 'Controls/menu';
import ShowMoreButton from 'Controls/ShowMoreButton';
import { Logger } from 'UI/Utils';
import { Memory } from 'Types/source';
import { Icon } from 'Controls/icon';
import 'css!Controls/AdaptiveChips';

const MORE_BTN_WIDTH_WITH_MARGIN = 44;

function AdaptiveChipsItemTemplate({ item }) {
    const icon = item.itemData.item.get('icon');
    const iconSize = item.itemData.item.get('iconSize');
    const iconStyle = item.itemData.item.get('iconStyle');
    const caption = item.itemData.item.get('caption');
    const counter = item.itemData.item.get('counter');
    return (
        <ItemTemplate
            {...item}
            multiline={false}
            contentTemplate={
                <div className="controls-padding_left-xs tw-flex tw-items-center">
                    {!!icon && (
                        <Icon
                            className="controls-margin_right-xs"
                            icon={icon}
                            iconStyle={iconStyle || 'secondary'}
                            iconSize={iconSize || 'm'}
                        />
                    )}
                    {!!caption && (
                        <div className={`${counter ? 'controls-margin_right-xs' : ''}`}>
                            {caption}
                        </div>
                    )}
                    {!!counter && (
                        <div className="controls-text-label controls-fontweight-default">
                            {counter}
                        </div>
                    )}
                </div>
            }
        />
    );
}

/**
 * Интерфейс, описывающий опции контрола "Адаптивные чипсы"
 * @public
 */
export interface IAdaptiveChipsProps extends Omit<IChipsOptions, 'multiline'> {}

/**
 *
 * Контрол "Адаптивные чипсы"
 * @demo Controls-demo/AdaptiveChips/Index
 * @public
 */
function AdaptiveChips(props: IAdaptiveChipsProps, ref: LegacyRef<HTMLDivElement>) {
    const { className, ...chipsProps } = props;

    const scrollRef = useRef(null);
    const scrollLeft = useRef(0);
    const hasPadding = useRef(false);
    const containerRef = useRef(null);

    const keyProperty = chipsProps.keyProperty || chipsProps.items?.getKeyProperty();

    let wrapperClassName = 'tw-flex tw-items-center controls-AdaptiveChips__wrapper';

    const menuSource = useMemo(
        (): Memory =>
            new Memory({
                keyProperty,
                adapter: chipsProps.items.getAdapter(),
                data: chipsProps.items.getRawData(),
            }),
        [chipsProps.keyProperty, chipsProps.items]
    );

    const mouseWheelHandler = useCallback((event: SyntheticEvent) => {
        if (event.nativeEvent?.deltaY) {
            event.preventDefault();
            if (scrollRef?.current) {
                scrollRef.current.scrollTo(
                    scrollLeft.current + event.nativeEvent?.deltaY,
                    'horizontal',
                    true
                );
            }
        }
    }, []);

    const scrollStateChangedHandler = useCallback((_: SyntheticEvent, state: IScrollState) => {
        scrollLeft.current = state.scrollLeft as number;
    }, []);

    const setHasPadding = useCallback(() => {
        if (scrollRef.current) {
            hasPadding.current = scrollRef.current?._scrollModel?.canHorizontalScroll;
        }
    }, []);

    const checkSelectedKeyOnError = (): void => {
        const { selectedKeys } = chipsProps;
        const unexistingKeys = selectedKeys?.filter((elem) => !props.items.getRecordById(elem));
        if (props.items && unexistingKeys?.length) {
            Logger.error(
                'В RecordSet нет элемент(а/ов) с идентификатор(ом/ами),' +
                    ` переданным в опцию selectedKeys='${unexistingKeys}'`
            );
        }
    };

    const menuSelectedItemKeysChanged = useCallback((keys: unknown[]) => {
        if (chipsProps.onSelectedKeysChanged) {
            chipsProps.onSelectedKeysChanged(null, keys);
        }
    }, []);

    const scrollToFirstSelectedItem = () => {
        const selectedKeyFirstItem = chipsProps.selectedKeys?.sort((a, b) => a > b)[0];
        const activeContainer = containerRef.current.querySelector(
            `[name=controls-ButtonGroup_button-${selectedKeyFirstItem}]`
        ) as HTMLElement;
        if (activeContainer) {
            const activeContainerPaddingRight = parseFloat(
                getComputedStyle(activeContainer).paddingRight
            );
            const parentContainer = containerRef.current;
            if (
                activeContainer.offsetLeft +
                    activeContainer.offsetWidth +
                    activeContainerPaddingRight >
                    scrollLeft.current + parentContainer.offsetWidth ||
                activeContainer.offsetLeft < scrollLeft.current
            ) {
                const endScrollPosition =
                    activeContainer.offsetLeft -
                    (parentContainer.offsetWidth -
                        (activeContainer.offsetWidth + activeContainerPaddingRight));
                const startScrollPosition =
                    activeContainer.offsetLeft - activeContainerPaddingRight;
                const newScrollPosition =
                    scrollLeft.current < startScrollPosition
                        ? endScrollPosition
                        : startScrollPosition;

                scrollRef.current?.horizontalScrollTo?.(
                    newScrollPosition + MORE_BTN_WIDTH_WITH_MARGIN
                );
            }
        }
    };

    useEffect(() => {
        checkSelectedKeyOnError();
        if (chipsProps.selectedKeys?.length) {
            scrollToFirstSelectedItem();
        }
        setHasPadding();
    }, []);

    const setRef = (element: HTMLElement): void => {
        if (element) {
            containerRef.current = element;
        }
        if (ref) {
            if (typeof ref === 'function') {
                ref(element);
            } else {
                ref.current = element;
            }
        }
    };

    wrapperClassName += ` ${className}`;

    return (
        <div
            ref={setRef}
            className={wrapperClassName}
            name="controls-AdaptiveChips-container"
            onWheel={mouseWheelHandler}
        >
            <Container
                ref={scrollRef}
                scrollOrientation={SCROLL_MODE.HORIZONTAL}
                scrollbarVisible={false}
                backgroundStyle="default"
                shadowMode={SHADOW_MODE.BLUR}
                onScrollStateChanged={scrollStateChangedHandler}
                onViewportResize={setHasPadding}
            >
                <div className="tw-w-full tw-flex">
                    <Control
                        {...chipsProps}
                        className="controls-AdaptiveChips__buttonContainer"
                        multiline={false}
                    />
                </div>
            </Container>
            <Selector
                className="controls-AdaptiveChips__selector"
                selectedKeys={chipsProps.selectedKeys}
                onSelectedKeysChanged={menuSelectedItemKeysChanged}
                contentTemplate={ShowMoreButton}
                keyProperty={keyProperty}
                multiSelect={true}
                displayProperty="caption"
                itemTemplate={(item) => <AdaptiveChipsItemTemplate item={item} />}
                source={menuSource}
            />
        </div>
    );
}

export default forwardRef(AdaptiveChips);
