import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import * as template from 'wml!Controls-demo/ListCommands/Move/Simple/Index';
import { getListData as getData } from 'Controls-demo/OperationsPanelNew/DemoHelpers/DataCatalog';
import { View as TreeGrid } from 'Controls/treeGrid';
import { IColumn } from 'Controls/grid';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import ExpandedSource from './ExpandedSource';
import 'css!Controls-demo/ListCommands/ListCommands';
import 'wml!Controls-demo/ListCommands/templates/PersonInfo';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = template;
    protected _selectedKeys: string[] = [];
    protected _excludedkeys: string[] = [];
    protected _children: {
        treeGrid: TreeGrid;
    };
    protected _moveDialogOptions: object;
    protected _gridColumns: IColumn[] = [
        {
            template: 'wml!Controls-demo/ListCommands/templates/PersonInfo',
        },
    ];
    protected _columns: IColumn[] = [
        {
            displayProperty: 'department',
            width: '',
        },
    ];

    protected _beforeMount(options?: IProps): Promise<void> | void {
        this._moveDialogOptions = {
            templateName: 'Controls/moverDialog:Template',
            templateOptions: {
                root: null,
                rootVisible: true,
                keyProperty: 'id',
                parentProperty: 'Раздел',
                nodeProperty: 'Раздел@',
                columns: this._columns,
                source: options?._dataOptionsValue.listData.source,
            },
        };
    }

    protected _move(event: SyntheticEvent): void {
        this._children.treeGrid
            .moveItemsWithDialog(
                {
                    selected: this._selectedKeys,
                    excluded: this._excludedkeys,
                },
                {
                    target: event.target,
                }
            )
            .then(() => {
                this._selectedKeys = [];
                this._excludedkeys = [];
                this._children.treeGrid.reload();
            });
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new ExpandedSource({
                        keyProperty: 'id',
                        data: getData(),
                        useMemoryFilter: true,
                    }),
                    keyProperty: 'id',
                    multiSelectVisibility: 'visible',
                    selectedKeys: [],
                    excludedKeys: [],
                    nodeProperty: 'Раздел@',
                    parentProperty: 'Раздел',
                },
            },
        };
    },
});
