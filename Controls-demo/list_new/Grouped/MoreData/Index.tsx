import * as React from 'react';
import { View } from 'Controls/list';
import { generateData } from '../../DemoHelpers/DataCatalog';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const NUMBER_OF_ITEMS = 1000;
const COUNT_ITEMS_IN_GROUP = 200;

function getData() {
    return generateData<{ key: number; title: string; group: string }>({
        count: NUMBER_OF_ITEMS,
        entityTemplate: { title: 'string' },
        beforeCreateItemCallback: (item) => {
            item.group = `Group ${Math.trunc(item.key / COUNT_ITEMS_IN_GROUP)}`;
            item.title = `Запись с id="${item.key}". `;
        },
    });
}

const Demo = React.forwardRef((props, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <View storeId={'GroupedMoreData'} groupProperty={'group'} />
        </div>
    );
});

export default Object.assign(Demo, {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            GroupedMoreData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    navigation: {
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
                    },
                },
            },
        };
    },
});
