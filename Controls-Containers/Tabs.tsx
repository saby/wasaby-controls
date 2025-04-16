/**
 * @kaizenZone f43717a4-ecb5-4bdd-a32c-4ebbcb125017
 * @module
 * @public
 */
import { Children, useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { ISingleSelectableOptions } from 'Controls/interface';
import { Buttons as TabsButtons } from 'Controls/tabs';
import { RecordSet } from 'Types/collection';
import { ITabsProps } from './interface';
import * as rk from 'i18n!Controls-Containers';
import { StickyBlock, IFixedEventData } from 'Controls/stickyBlock';
import { scrollToElement } from 'Controls/scroll';
import 'css!Controls-Containers/Tabs';

const DEFAULT_ITEMS = [{ id: 1, title: rk('Первая вкладка'), align: 'left' }];
export const DEFAULT_VARIANTS = {
    items: DEFAULT_ITEMS,
    selectedKeys: [1],
};

function getSelectedKey(variants: ITabsProps['variants']): number {
    if (variants?.selectedKeys) {
        return variants.selectedKeys[0];
    }
    return variants?.items?.[0]?.id || 1;
}

/**
 * Виджет "Вкладки", который предоставляет пользователю возможность переключаться между вкладками.
 * @demo Controls-Containers-demo/Base/Index
 * @public
 */
function Tabs(props: ITabsProps) {
    const variants = (props.variants || {}) as ITabsProps['variants'];
    const scrolledElRef = useRef<HTMLDivElement | null>(null);
    const isFixed = useRef<boolean>(true);
    // При 1 построении всегда отобразим 1 вкладку, поэтому записываем состояние компонента
    const mounted = useRef(false);
    const [selectedKey, setSelectedKey] = useState(() => {
        return variants?.items?.[0]?.id || DEFAULT_VARIANTS.selectedKeys[0];
    });
    const onSelectedKeyChanged = useCallback<
        NonNullable<ISingleSelectableOptions['onSelectedKeyChanged']>
    >(
        (key) => {
            setSelectedKey(key as number);
            if (scrolledElRef.current && isFixed.current) {
                scrollToElement(scrolledElRef.current, 'top', true, false, 0, true);
            }
        },
        [setSelectedKey]
    );
    const items = useMemo(() => {
        return new RecordSet({
            keyProperty: 'id',
            rawData: (variants.items ?? DEFAULT_VARIANTS.items).map((item) =>
                props.align ? { ...item, align: props.align } : item
            ),
        });
    }, [variants.items, props.align]);
    const onClick = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);
    const onFixed = useCallback((fixed: IFixedEventData) => {
        isFixed.current = !!fixed.fixedPosition;
    }, []);

    useEffect(() => {
        if (mounted.current) {
            setSelectedKey(getSelectedKey(variants));
        }
        mounted.current = true;
    }, [variants]);

    let className = 'Tabs_container tw-flex tw-flex-col';
    if (props.className) {
        className += ` ${props.className}`;
    }
    // Есть проблема когда вкладку вставляют внутри другой вкладки, где задан широкий вид.
    // Проблема заключается в том, что стили широкой вкладки навешиваются на добавленную вкладку, хотя ожидалось что вкладка отобразится в нормальном виде
    if (!props.className?.includes?.('controls-Tabs_style-')) {
        className += ' controls-Tabs_style-online';
    }
    if (props['.style']?.reference) {
        className += ` ${props['.style'].reference}`;
    }
    if (props.viewMode) {
        className += ` controls-Tabs_style-${props.viewMode === 'bordered' ? 'wide' : 'online'}`;
    }

    return (
        <div className={className} style={props.style} data-qa={props.dataQa}>
            <StickyBlock
                onFixed={onFixed}
                backgroundStyle="transparent"
                fixedBackgroundStyle="default"
            >
                <TabsButtons
                    items={items}
                    selectedKey={selectedKey}
                    keyProperty="id"
                    // @ts-ignore
                    onClick={onClick}
                    onSelectedKeyChanged={onSelectedKeyChanged}
                    canShrink={true}
                    selectedStyle={props.selectedStyle}
                />
            </StickyBlock>
            <div ref={scrolledElRef}></div>
            <div className="tw-flex tw-flex-col tw-w-full">
                {Children.toArray(props.children).map((children, index) => {
                    if (items.at(index)?.get?.('id') === selectedKey) {
                        return children;
                    }
                    return null;
                })}
            </div>
        </div>
    );
}

Tabs.displayName = 'Controls-Containers/Tabs';
export default Tabs;
