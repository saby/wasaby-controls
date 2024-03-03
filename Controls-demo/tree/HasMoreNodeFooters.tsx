import * as React from 'react';
import { HierarchicalMemory } from 'Types/source';
import { View as TreeView } from 'Controls/tree';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const Demo = React.forwardRef((_, ref) => {
    return (
        <div ref={ref}>
            <TreeView storeId={'HasMoreNodeFooters'} />
        </div>
    );
});

export default Object.assign(Demo, {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            HasMoreNodeFooters: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        data: [
                            {
                                key: 1,
                                title: 'Apple',
                                parent: null,
                                node: true,
                            },
                            {
                                key: 11,
                                title: 'Notebooks',
                                parent: 1,
                                node: false,
                            },
                            {
                                key: 12,
                                title: 'IPhones',
                                country: 'США',
                                rating: '8.5',
                                parent: 1,
                                node: false,
                            },
                            {
                                key: 121,
                                title: 'IPhone XS',
                                parent: 12,
                                node: null,
                            },
                            {
                                key: 122,
                                title: 'IPhone X',
                                parent: 12,
                                node: null,
                            },
                            {
                                key: 123,
                                title: 'IPhone XS Max',
                                parent: 12,
                                node: null,
                            },
                            {
                                key: 124,
                                title: 'IPhone 8',
                                parent: 12,
                                node: null,
                            },
                            {
                                key: 13,
                                title: 'iPad Air 2015',
                                parent: 1,
                                node: null,
                            },
                            {
                                key: 14,
                                title: 'iPad Air 2017',
                                parent: 1,
                                node: null,
                            },
                        ],
                    }),
                    navigation: {
                        source: 'page',
                        view: 'demand',
                        sourceConfig: {
                            pageSize: 3,
                            page: 0,
                            hasMore: false,
                        },
                    },
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'node',
                },
            },
        };
    },
});
