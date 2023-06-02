import * as React from 'react';

import { RecordSet } from 'Types/collection';

import { View as ListView, IVirtualScrollConfig } from 'Controls/list';
import { Container as ScrollContainer } from 'Controls/scroll';

import 'css!Controls-demo/list_new/Marker/MarkerClassName/Style';
import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';

const ITEMS_COUNT = 150;
const GROUP_ITEMS_COUNT = 10;

interface IItem {
    key: number;
    title: string;
    group: string;
}

function StickyGroupsDemo(
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
                    item.group = `group-${Math.ceil(item.key / GROUP_ITEMS_COUNT)}`;
                },
            }),
        });
    }, []);

    const virtualScrollConfig = React.useMemo<IVirtualScrollConfig>(() => {
        return { pageSize: 30 };
    }, []);

    return (
        <div
            ref={ref}
            className={'controlsDemo__wrapper controlsDemo_fixedWidth500'}
        >
            <ScrollContainer
                className={'controlsDemo__height500'}
            >
                <ListView
                   items={items}
                   virtualScrollConfig={virtualScrollConfig}
                   keyProperty={'key'}
                   displayProperty={'title'}
                   groupProperty={'group'}
                   stickyGroup={true}
                />
            </ScrollContainer>
        </div>
    );
}

export default React.forwardRef(StickyGroupsDemo);
