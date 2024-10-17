import * as React from 'react';
import { RecordSet } from 'Types/collection';
import { ItemsView as ListItemsView } from 'Controls/list';
import { Button } from 'Controls/buttons';
import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { groupConstants } from 'Controls/display';

const ITEMS_IN_GROUP = 5;

function ListWithGroupingDemo(_: object, ref: React.ForwardedRef<HTMLDivElement>) {
    const items = React.useMemo(() => {
        return new RecordSet({
            rawData: generateData({
                count: 10,
                beforeCreateItemCallback: (item: { key: number; title: string; group: string }) => {
                    item.title = `Запись с ключом ${item.key}`;
                    item.group =
                        item.key < ITEMS_IN_GROUP ? groupConstants.hiddenGroup : 'Группа 1';
                },
            }),
            keyProperty: 'key',
        });
    }, []);

    const removeItemAt = (index) => {
        return items.removeAt(index);
    };

    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth500">
            <Button
                caption={'Remove item before group'}
                onClick={() => {
                    return removeItemAt(4);
                }}
            />
            <Button
                caption={'Remove item after group'}
                onClick={() => {
                    return removeItemAt(5);
                }}
            />
            <ListItemsView items={items} itemsSpacing={'l'} groupProperty={'group'} />
        </div>
    );
}

export default React.forwardRef(ListWithGroupingDemo);
