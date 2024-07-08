import * as React from 'react';
import { RecordSet } from 'Types/collection';
import { ItemsView as ListItemsView } from 'Controls/list';
import { Button } from 'Controls/buttons';
import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { Model } from 'Types/entity';

function ListDemo(_: object, ref: React.ForwardedRef<HTMLDivElement>) {
    const items = React.useMemo(() => {
        return new RecordSet({
            rawData: generateData({
                count: 5,
                beforeCreateItemCallback: (item: { key: number; title: string }) => {
                    item.title = `Запись с ключом ${item.key}`;
                },
            }),
            keyProperty: 'key',
        });
    }, []);

    const removeItemAt = (index) => {
        return items.removeAt(index);
    };
    const removeItemsAt = (index) => {
        items.setEventRaising(false, true);
        removeItemAt(index);
        removeItemAt(Math.max(index - 1, 0));
        items.setEventRaising(true, true);
    };
    const removeAllItems = () => {
        items.setEventRaising(false, true);
        while (items.getCount()) {
            removeItemAt(0);
        }
        items.setEventRaising(true, true);
    };

    const addItemAt = (index) => {
        const newItemKey = items.getCount();
        const newItem = new Model({
            rawData: {
                key: newItemKey,
                title: `Запись с ключом ${newItemKey}`,
            },
        });
        items.add(newItem, index);
    };
    const addItems = (index) => {
        items.setEventRaising(false, true);
        addItemAt(index);
        addItemAt(index);
        items.setEventRaising(true, true);
    };

    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth500">
            <Button
                caption={'Remove item from start'}
                onClick={() => {
                    return removeItemAt(0);
                }}
            />
            <Button
                caption={'Remove 2 items from start'}
                onClick={() => {
                    return removeItemsAt(0);
                }}
            />
            <Button
                caption={'Remove item from middle'}
                onClick={() => {
                    return removeItemAt(2);
                }}
            />
            <Button
                caption={'Remove 2 items from middle'}
                onClick={() => {
                    return removeItemsAt(3);
                }}
            />
            <Button
                caption={'Remove last item'}
                onClick={() => {
                    return removeItemAt(items.getCount() - 1);
                }}
            />
            <Button
                caption={'Remove 2 last items'}
                onClick={() => {
                    return removeItemsAt(items.getCount() - 1);
                }}
            />
            <Button
                caption={'Remove all items'}
                onClick={() => {
                    return removeAllItems();
                }}
            />
            <Button
                caption={'Add item to start'}
                onClick={() => {
                    return addItemAt(0);
                }}
            />
            <Button
                caption={'Add 2 items to start'}
                onClick={() => {
                    return addItems(0);
                }}
            />
            <Button
                caption={'Add item to middle'}
                onClick={() => {
                    return addItemAt(3);
                }}
            />
            <Button
                caption={'Add 2 items to middle'}
                onClick={() => {
                    return addItems(2);
                }}
            />
            <Button
                caption={'Add item to end'}
                onClick={() => {
                    return addItemAt(undefined);
                }}
            />
            <Button
                caption={'Add 2 items to end'}
                onClick={() => {
                    return addItems(undefined);
                }}
            />
            <ListItemsView items={items} itemsSpacing={'l'} />
        </div>
    );
}

export default React.forwardRef(ListDemo);
