import * as React from 'react';
import 'Controls/gridReact';
import { View as TreeGridView } from 'Controls/treeGrid';
import { TInternalProps } from 'UICore/Executor';
import { HierarchicalMemory } from 'Types/source';
import { IDataConfig } from 'Controls-DataEnv/dataFactory';
import { IListDataFactoryArguments } from 'Controls/dataFactory';
import { useSlice } from 'Controls-DataEnv/context';
import { HeadingPath, Back } from 'Controls-ListEnv/breadcrumbs';
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'UICommon/Events';
import { getData } from './Data';

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const slice = useSlice('TreeGridBreadCrumbs');
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
        {
            key: 'countryHeader',
            render: (
                <HeadingPath
                    _dataOptionsValue={{ TreeGridBreadCrumbs: slice }}
                    storeId="TreeGridBreadCrumbs"
                    additionalTextProperty={'description'}
                    withoutBackButton={true}
                />
            ),
        },
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
        {
            key: 'countryHeader',
            render: (
                <Back
                    storeId="TreeGridBreadCrumbs"
                    _dataOptionsValue={{ TreeGridBreadCrumbs: slice }}
                    fontSize="s"
                />
            ),
        },
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
            <TreeGridView
                onItemClick={onItemClick}
                storeId="TreeGridBreadCrumbs"
                columns={columns}
                header={headers}
                resultsPosition={'top'}
                results={results}
                rowSeparatorSize="s"
            />
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            TreeGridBreadCrumbs: {
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
