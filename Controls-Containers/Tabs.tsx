/**
 * @kaizenZone f43717a4-ecb5-4bdd-a32c-4ebbcb125017
 * @module
 * @public
 */
import { Children, useCallback, useEffect, useMemo, useState } from 'react';
import { Buttons as TabsButtons } from 'Controls/tabs';
import { RecordSet } from 'Types/collection';
import { ITabsProps } from './interface';
import * as rk from 'i18n!Controls-Containers';
import 'css!Controls-Containers/Tabs';

const DEFAULT_ITEMS = [{ id: 1, title: rk('Первая вкладка'), align: 'left' }];

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
    const [selectedKey, setSelectedKey] = useState(() => {
        return getSelectedKey(variants);
    });
    const onSelectedKeyChanged = useCallback(
        (key: number) => {
            setSelectedKey(key);
        },
        [setSelectedKey]
    );
    const items = useMemo(() => {
        return new RecordSet({
            keyProperty: 'id',
            rawData: variants.items ?? DEFAULT_ITEMS,
        });
    }, [variants.items]);
    const onClick = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    useEffect(() => {
        setSelectedKey(getSelectedKey(variants));
    }, [variants.selectedKeys]);

    let className = 'Tabs_container tw-flex tw-flex-col';
    if (props.className) {
        className += ` ${props.className}`;
    }
    if (props['.style']?.reference) {
        className += ` ${props['.style'].reference}`;
    }
    if (props.viewMode) {
        className += ` controls-Tabs_style-${props.viewMode === 'bordered' ? 'wide' : 'online'}`;
    }

    return (
        <div className={className} style={props.style} data-qa={props.dataQa}>
            <TabsButtons
                items={items}
                selectedKey={selectedKey}
                keyProperty="id"
                // @ts-ignore
                onClick={onClick}
                onSelectedKeyChanged={onSelectedKeyChanged}
                canShrink={true}
            />
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
