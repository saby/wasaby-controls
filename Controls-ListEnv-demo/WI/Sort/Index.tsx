import * as React from 'react';
import { IColumnConfig, IHeaderConfig } from 'Controls/grid';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { TInternalProps } from 'UICore/Executor';
import { View as ToolbarView } from 'Controls/toolbars';
import { View as TreeGridView } from 'Controls/treeGrid';
import { Container as ToolbarContainer } from 'Controls-ListEnv/toolbarConnected';

import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import ExpandedSource from 'Controls-demo/treeGridNew/DemoHelpers/ExpandedSource';
import { useContent } from 'UICore/Jsx';

function getData() {
    return Flat.getData();
}

const columns: IColumnConfig[] = [
    {
        displayProperty: 'title',
    },
    {
        displayProperty: 'rating',
    },
];

const header: IHeaderConfig[] = [
    {
        caption: 'title',
        key: 'title',
    },
    {
        caption: 'rating',
        key: 'rating',
    },
];

function Demo(_props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>) {
    // ToolbarContainer внутри использует WML контрол Controls/actions:Container,
    // в который вставляется опция content и ей уже накидываются опции, например menuSource.
    // В виде нативного React-HOC это не работает (меню откроется без опций).
    const toolbarContent = useContent(
        (toolbarProps: object, toolbarRef: React.ForwardedRef<ToolbarView>) => {
            return <ToolbarView {...toolbarProps} forwardedRef={toolbarRef} direction="vertical" />;
        },
        []
    );
    return (
        <div ref={ref} className="controlsDemo__wrapper tw-flex">
            <TreeGridView name="treeGrid" storeId="Sort" columns={columns} header={header} />
            <ToolbarContainer
                storeId="Sort"
                actions="Controls-ListEnv-demo/WI/Sort/listActions"
                content={toolbarContent}
                className="controls-background-unaccented"
            />
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            Sort: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        parentProperty: 'parent',
                        keyProperty: 'key',
                        data: getData(),
                        useMemoryFilter: true,
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                    multiSelectVisibility: 'visible',
                    listActions: 'Controls-ListEnv-demo/WI/Sort/listActions',
                    operationsPanelVisible: true,
                    sorting: [{ title: 'ASC' }],
                },
            },
        };
    },
});
