import * as React from 'react';

import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';

import { Button } from 'Controls/buttons';
import { View as ListView, IVirtualScrollConfig } from 'Controls/list';
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

function AddItemInStartDemo(
    _: unknown,
    ref: React.ForwardedRef<HTMLDivElement>
): JSX.Element {
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

    return (
        <div
            ref={ref}
            className={'controlsDemo__wrapper controlsDemo_fixedWidth500'}
        >
            <Button
                caption={'Add item at 3'}
                onClick={() => {
                    return addItemAt(3);
                }}
            />
            <Button
                caption={'Add item at 100'}
                onClick={() => {
                    return addItemAt(100);
                }}
            />
            <ScrollContainer
                className={'controlsDemo__height500'}
            >
                <ListView
                   items={items}
                   virtualScrollConfig={virtualScrollConfig}
                   displayProperty={'title'}
                />
            </ScrollContainer>
        </div>
    );
}

export default React.forwardRef(AddItemInStartDemo);
