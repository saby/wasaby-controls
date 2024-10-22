import * as React from 'react';
import { TInternalProps } from 'UICore/executor';
import { View as TreeGridView } from 'Controls/treeGrid';
import { IListDataFactoryArguments, IDataConfig } from 'Controls/dataFactory';
import MultiNavigationMemory from 'Controls-demo/DemoData/MultiNavigationMemory';

const data = [
    {
        key: 1,
        title: 'Apple',
        country: 'США',
        rating: '8.5',
        parent: null,
        type: true,
    },
    {
        key: 11,
        title: 'Notebooks',
        country: 'США',
        rating: '8.5',
        parent: 1,
        type: false,
    },
    {
        key: 12,
        title: 'IPhones',
        country: 'США',
        rating: '8.5',
        parent: 1,
        type: false,
    },
    {
        key: 121,
        title: 'IPhone XS',
        country: 'США',
        rating: '8.5',
        parent: 12,
        type: null,
    },
    {
        key: 122,
        title: 'IPhone X',
        country: 'США',
        rating: '8.5',
        parent: 12,
        type: null,
    },
    {
        key: 123,
        title: 'IPhone XS Max',
        country: 'США',
        rating: '8.5',
        parent: 12,
        type: null,
    },
    {
        key: 124,
        title: 'IPhone 8',
        country: 'США',
        rating: '8.5',
        parent: 12,
        type: null,
    },
    {
        key: 13,
        title: 'iPad Air 2015',
        country: 'США',
        rating: '8.5',
        parent: 1,
        type: null,
    },
    {
        key: 14,
        title: 'iPad Air 2017',
        country: 'США',
        rating: '8.5',
        parent: 1,
        type: null,
    },
];

const columns = [
    {
        displayProperty: 'title',
        width: '',
    },
    {
        displayProperty: 'rating',
        width: '',
    },
    {
        displayProperty: 'country',
        width: '',
    },
];

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    return (
        <div ref={ref} className="controlsDemo__cell">
            <TreeGridView
                storeId="NodeFooterWIMoreButton"
                columns={columns}
                useNewNodeFooters={true}
            />
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            NodeFooterWIMoreButton: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new MultiNavigationMemory({
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        data,
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    deepReload: true,
                    expandedItems: [1, 12],
                    navigation: {
                        source: 'page',
                        view: 'demand',
                        sourceConfig: {
                            pageSize: 3,
                            page: 0,
                            hasMore: false,
                            multiNavigation: true,
                        },
                        viewConfig: {
                            pagingMode: 'basic',
                        },
                    },
                },
            },
        };
    },
});
