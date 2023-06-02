import * as React from 'react';
import { View } from 'Controls/list';
import {
    INavigationOptionValue,
    INavigationPageSourceConfig,
} from 'Controls/interface';
import { generateData } from '../../DemoHelpers/DataCatalog';
import { Memory } from 'Types/source';

const NUMBER_OF_ITEMS = 1000;
const COUNT_ITEMS_IN_GROUP = 200;
const DATA = generateData<{ key: number; title: string; group: string }>({
    count: NUMBER_OF_ITEMS,
    entityTemplate: { title: 'string' },
    beforeCreateItemCallback: (item) => {
        item.group = `Group ${Math.trunc(item.key / COUNT_ITEMS_IN_GROUP)}`;
        item.title = `Запись с id="${item.key}". `;
    },
});

export default React.forwardRef((props, ref) => {
    const source = new Memory({
        keyProperty: 'key',
        data: DATA,
    });
    const navigation: INavigationOptionValue<INavigationPageSourceConfig> = {
        viewConfig: {
            pagingMode: 'basic',
        },
        sourceConfig: {
            pageSize: 50,
            page: 0,
            hasMore: false,
        },
        source: 'page',
        view: 'infinity',
    };

    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <View
                source={source}
                navigation={navigation}
                keyProperty={'key'}
                groupProperty={'group'}
            />
        </div>
    );
});
