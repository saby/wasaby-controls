import { Children, useCallback, useEffect, useMemo, useState } from 'react';
import { Buttons as TabsButtons } from 'Controls/tabs';
import { RecordSet } from 'Types/collection';
import { ITabsProps } from './interface';
import * as rk from 'i18n!Controls-Containers';
import 'css!Controls-Containers/Tabs';

const DEFAULT_ITEMS = [{ id: 1, title: rk('Первая вкладка'), align: 'left' }];

function Tabs(props: ITabsProps) {
    const variants = (props.variants || {}) as ITabsProps['variants'];
    const [selectedKey, setSelectedKey] = useState(variants.selectedKeys?.[0] || 1);
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

    useEffect(() => {
        setSelectedKey(variants.selectedKeys?.[0] || 1);
    }, [variants.selectedKeys]);

    return (
        <div
            className={`tw-flex tw-flex-col ${props.className}`}
            style={props.style}
            data-qa={props.dataQa}
        >
            <TabsButtons
                items={items}
                selectedKey={selectedKey}
                keyProperty="id"
                onSelectedKeyChanged={onSelectedKeyChanged}
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