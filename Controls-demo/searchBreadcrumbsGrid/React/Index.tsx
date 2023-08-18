import * as React from 'react';

import { Memory } from 'Types/source';

import 'Controls/gridReact';
import 'Controls/gridColumnScroll';
import { View } from 'Controls/searchBreadcrumbsGrid';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { Gadgets } from 'Controls-demo/explorerNew/DataHelpers/DataCatalog';

const SOURCE = new Memory({
    keyProperty: 'id',
    data: Gadgets.getSearchData(true),
});

const HEADER = [
    {
        key: 1,
        title: 'Наименование',
    },
    {
        key: 2,
        title: 'Код',
    },
    {
        key: 3,
        title: 'Цена',
    },
];

const COLUMNS = Gadgets.getSearchColumns().map((c, index) => ({
    key: index,
    ...c,
}));

export default Object.assign(
    React.forwardRef((_: object, ref: React.ForwardedRef<HTMLDivElement>) => {
        return (
            <div ref={ref}>
                <View storeId={'listData'} header={HEADER} columns={COLUMNS} columnScroll={true} />
            </div>
        );
    }),
    {
        getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
            return {
                listData: {
                    dataFactoryName: 'Controls/dataFactory:List',
                    dataFactoryArguments: {
                        displayProperty: 'title',
                        source: SOURCE,
                        keyProperty: 'id',
                        parentProperty: 'parent',
                        nodeProperty: 'parent@',
                        multiSelectVisibility: 'visible',
                    },
                },
            };
        },
    }
);
