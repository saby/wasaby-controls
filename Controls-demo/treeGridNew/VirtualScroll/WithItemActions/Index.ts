import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { HierarchicalMemory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { IItemAction } from 'Controls/itemActions';

import { VirtualScrollHasMore } from 'Controls-demo/treeGridNew/DemoHelpers/Data/VirtualScrollHasMore';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { getActionsForContacts as getItemActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';

import * as Template from 'wml!Controls-demo/treeGridNew/VirtualScroll/WithItemActions/Template';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

function getData() {
    return VirtualScrollHasMore.getDataForVirtual();
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[];
    protected _itemActions: IItemAction[] = getItemActions();

    protected _beforeMount(): void {
        this._columns = Flat.getColumns();
        this._columns[1].width = '50px';
        this._columns[2].width = '200px';
    }

    protected _expandAll(): void {
        const slice = this._options._dataOptionsValue.VirtualScrollWithItemActions;
        slice.setState({
            source: new HierarchicalMemory({
                keyProperty: 'key',
                parentProperty: 'parent',
                data: VirtualScrollHasMore.getDataForVirtual(),
                filter: (): boolean => {
                    return true;
                },
            }),
        });
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            VirtualScrollWithItemActions: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                },
            },
        };
    },
});
