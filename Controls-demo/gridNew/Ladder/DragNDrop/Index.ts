import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Ladder/DragNDrop/DragNDrop';
import { Memory } from 'Types/source';
import * as Dnd from 'Controls/dragnDrop';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Collection } from 'Controls/display';
import { Model, Record } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { TItemsReadyCallback } from 'Controls-demo/types';
import { IItemAction } from 'Controls/interface';
import { showType } from 'Controls/toolbars';
import { Tasks } from 'Controls-demo/gridNew/DemoHelpers/Data/Tasks';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

interface INoStickyLadderColumn {
    template: string;
    width: string;
}

const { getData } = Tasks;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _itemsReadyCallback: TItemsReadyCallback = this._itemsReady.bind(this);
    protected _columns: INoStickyLadderColumn[] = Tasks.getColumns();
    private _itemsFirst: RecordSet = null;
    protected _ladderProperties: string[] = ['photo', 'date'];
    private _selectedKeys: number[] = [];
    protected _itemActions: IItemAction = [
        {
            id: 1,
            icon: 'icon-Erase',
            iconStyle: 'danger',
            title: 'delete',
            style: 'bordered',
            showType: showType.TOOLBAR,
            handler: function (item: Record): void {
                this._children.list
                    .removeItems({
                        selected: [item.get('key')],
                        excluded: [],
                    })
                    .then(() => {
                        this._children.list.reload();
                    });
            }.bind(this),
        },
    ];

    private _itemsReady(items: RecordSet): void {
        this._itemsFirst = items;
    }

    protected _dragStart(_: SyntheticEvent, items: number[]): void {
        const firstItem = this._itemsFirst.getRecordById(items[0]);

        return new Dnd.ItemsEntity({
            items,
            title: firstItem.get('title'),
        });
    }

    protected _dragEnd(
        _: SyntheticEvent,
        entity: Collection<Model>,
        target: unknown,
        position: string
    ): void {
        this._children.list.moveItems(
            { selected: entity.getItems() },
            target.getKey(),
            position,
            'Controls/viewCommands:Reload'
        );
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
        };
    }
}
