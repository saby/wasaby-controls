import * as React from 'react';
import 'Controls/gridReact';

import { TInternalProps } from 'UICore/Executor';
import { HierarchicalMemory } from 'Types/source';
import { IDataConfig } from 'Controls-DataEnv/dataFactory';
import { IListDataFactoryArguments } from 'Controls/dataFactory';
import { useSlice } from 'Controls-DataEnv/context';
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'UICommon/Events';
import { getData } from './Data';
import { View as ExplorerView } from 'Controls/explorer';
import { RecordSet } from 'Types/collection';

function generateResults(items: RecordSet): Model {
    const results = new Model({
        adapter: items.getAdapter(),

        format: [
            {
                name: 'category',
                type: 'string',
            },
            {
                name: 'result',
                type: 'string',
            },
            {
                name: 'key',
                type: 'real',
            },
        ],
    });

    const data = getData();

    results.set('result', data[0].result);
    results.set('key', data[0].key);

    return results;
}

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const slice = useSlice('ExplorerBreadCrumbs');
    if (slice) {
        const items = slice.state?.items;
        items.setMetaData({
            ...items.getMetaData(),
            results: generateResults(items),
        });
    }
    const [root, setRoot] = React.useState(200);
    const columns = [
        {
            width: '450px',
            displayProperty: 'category',
        },
        {
            width: '300px',
            key: 'description',
            displayProperty: 'description',
        },
        {
            width: '100px',
            key: 'id',
            displayProperty: 'key',
        },
    ];
    const headers = [
        {},
        {
            width: '100px',
            key: 'description',
            caption: 'Описание ',
        },
        {
            width: '100px',
            key: 'key',
            caption: 'Ключ',
        },
    ];
    const results = [
        {},
        {
            width: '100px',
            key: 'description',
            render: <div>Результаты</div>,
        },
        {
            width: '100px',
            key: 'key',
            render: <div>Ключ</div>,
        },
    ];

    const onItemClick = (item: Model, event: SyntheticEvent) => {
        if (item.get('node')) {
            slice?.setRoot(item.getKey());
            setRoot(item.getKey());
        }
    };

    return (
        <div className={'controlsDemo__wrapper'} data-qa="controlsDemo_gridReact_ItemOptionsGrid">
            <ExplorerView
                onItemClick={onItemClick}
                storeId="ExplorerBreadCrumbs"
                breadcrumbsDisplayMode="multiline"
                columns={columns}
                header={headers}
                results={results}
                resultsPosition={'top'}
                rowSeparatorSize="s"
            />
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ExplorerBreadCrumbs: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new HierarchicalMemory({
                        data: getData(),
                        keyProperty: 'key',
                        parentProperty: 'parent',
                    }),
                    keyProperty: 'key',
                    displayProperty: 'category',
                    parentProperty: 'parent',
                    nodeProperty: 'node',
                    root: 11,
                },
            },
        };
    },
});
