import * as React from 'react';
import { Gadgets } from '../DataHelpers/DataCatalog';
import { IColumn } from 'Controls/grid';
import { HierarchicalMemory } from 'Types/source';
import { TInternalProps } from 'UICore/Executor';
import { View as ExplorerView } from 'Controls/explorer';
import { ItemTemplate as ListItemTemplate } from 'Controls/list';
import { IListDataFactoryArguments, IDataConfig } from 'Controls/dataFactory';
import { CollectionItem, IItemPadding } from 'Controls/display';
import { useSlice } from 'Controls-DataEnv/context';

const columns: IColumn[] = Gadgets.getColumns();

const itemPadding: IItemPadding = {
    top: 's',
    bottom: 's',
    left: 'S',
    right: 'S',
};

function Demo(props: TInternalProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    const slice = useSlice('ExplorerItemsSpacing');
    const itemTemplate = React.useMemo(() => {
        return React.forwardRef(
            (
                itemTemplateProps: { item: CollectionItem },
                itemTemplateRef: React.ForwardedRef<unknown>
            ) => {
                return (
                    <ListItemTemplate {...itemTemplateProps} ref={itemTemplateRef}>
                        <div>{itemTemplateProps.item.contents.get('title')}</div>
                    </ListItemTemplate>
                );
            }
        );
    }, []);

    const toggleMultiSelectVisibility = React.useCallback(() => {
        const visibility = slice?.state.multiSelectVisibility;
        slice.setState({
            multiSelectVisibility: visibility === 'hidden' ? 'visible' : 'hidden',
        });
    }, [slice]);

    return (
        <div ref={ref} {...props} className="controlsDemo__wrapper controlsDemo_fixedWidth550">
            <button onClick={toggleMultiSelectVisibility}>Toggle multiSelect</button>
            <ExplorerView
                storeId="ExplorerItemsSpacing"
                className="demo-Explorer ControlsDemo-Explorer"
                itemsSpacing="l"
                itemsSpacingVisibility="all"
                columns={columns}
                itemPadding={itemPadding}
                itemTemplate={itemTemplate}
            />
        </div>
    );
}

export default Object.assign(React.forwardRef(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ExplorerItemsSpacing: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new HierarchicalMemory({
                        keyProperty: 'id',
                        data: Gadgets.getData(),
                        parentProperty: 'parent',
                    }),
                    keyProperty: 'id',
                    viewMode: 'list',
                    parentProperty: 'parent',
                    nodeProperty: 'parent@',
                    multiSelectVisibility: 'visible',
                },
            },
        };
    },
});
