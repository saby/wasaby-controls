import * as React from 'react';

import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';

import { Button } from 'Controls/buttons';
import { ItemsView as ListView, ItemTemplate, IVirtualScrollConfig } from 'Controls/list';
import { Container as ScrollContainer } from 'Controls/scroll';

import 'css!Controls-demo/list_new/Marker/MarkerClassName/Style';
import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';

const ITEMS_COUNT = 150;

interface IItem {
    title: string;
    key: number;
    keyProperty: string;
    count: number;
}

function AddItemInStartDemo(_: unknown, ref: React.ForwardedRef<HTMLDivElement>): JSX.Element {
    const items = React.useMemo(() => {
        return new RecordSet({
            keyProperty: 'key',
            rawData: generateData({
                keyProperty: 'key',
                count: ITEMS_COUNT,
                beforeCreateItemCallback: (item: IItem) => {
                    item.title = `Запись с ключом ${item.key}.`;
                },
            }),
        });
    }, []);

    const virtualScrollConfig = React.useMemo<IVirtualScrollConfig>(() => {
        return { pageSize: 50 };
    }, []);

    const addItemAt = (index: number) => {
        items.add(
            new Model({
                rawData: {
                    key: items.getCount(),
                    title: `Запись с ключом ${items.getCount()}.`,
                },
            }),
            index
        );
    };

    const replaceItemAt = (index: number) => {
        const item = items.at(index).clone();
        item.set('title', `${item.get('title')} \n(replaced)`);
        items.replace(item, index);
    };

    const changeAndMoveToStart = (index: number) => {
        replaceItemAt(index);

        items.move(index, 0);
    };

    return (
        <div ref={ref} className={'controlsDemo__wrapper controlsDemo_fixedWidth500'}>
            <Button
                caption={'Add item at 3'}
                onClick={() => {
                    return addItemAt(3);
                }}
            />
            <Button
                caption={'Remove item at 3'}
                onClick={() => {
                    return items.removeAt(3);
                }}
            />
            <Button
                caption={'Replace item at 3'}
                onClick={() => {
                    return replaceItemAt(3);
                }}
            />
            <Button
                caption={'Change item at 3 and move it to start'}
                onClick={() => {
                    return changeAndMoveToStart(3);
                }}
            />
            <ScrollContainer className={'controlsDemo__height500'}>
                <ListView
                    items={items}
                    virtualScrollConfig={virtualScrollConfig}
                    displayProperty={'title'}
                    itemTemplate={(props) => (
                        <ItemTemplate {...props} attrs={{ style: { whiteSpace: 'pre-wrap' } }} />
                    )}
                />
            </ScrollContainer>
        </div>
    );
}

export default React.forwardRef(AddItemInStartDemo);
