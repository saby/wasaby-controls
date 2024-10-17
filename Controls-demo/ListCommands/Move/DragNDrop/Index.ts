import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/ListCommands/Move/DragNDrop/Index';
import { getListData as getData } from 'Controls-demo/OperationsPanelNew/DemoHelpers/DataCatalog';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { View as TreeGrid } from 'Controls/treeGrid';
import { IColumn } from 'Controls/grid';
import { ListItems } from 'Controls/dragnDrop';
import { LOCAL_MOVE_POSITION } from 'Types/source';
import 'css!Controls-demo/ListCommands/ListCommands';
import 'wml!Controls-demo/ListCommands/templates/PersonInfo';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _children: {
        treeGrid: TreeGrid;
    };
    protected _gridColumns: IColumn[] = [
        {
            template: 'wml!Controls-demo/ListCommands/templates/PersonInfo',
        },
    ];

    protected _dragEnd(
        event: Event,
        entity: RecordSet,
        target: Model,
        position: LOCAL_MOVE_POSITION
    ): void {
        this._children.treeGrid
            .moveItems(
                {
                    selected: entity.getItems(),
                    excluded: [],
                },
                target.getKey(),
                position
            )
            .then(() => {
                this._children.treeGrid.reload();
            });
    }

    protected _dragStart(event: Event, items: object[]): void {
        return new ListItems({
            items,
        });
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'id',
                        data: getData(),
                    }),
                    keyProperty: 'id',
                    parentProperty: 'Раздел',
                    nodeProperty: 'Раздел@',
                },
            },
        };
    }
}
