import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory, CrudEntityKey } from 'Types/source';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';

import * as Template from 'wml!Controls-demo/list_new/MoveController/Base/Base';

const data = [
    {
        key: 0,
        title: 'Перемещение записей 1',
    },
    {
        key: 1,
        title: 'Перемещение записей 2',
    },
    {
        key: 2,
        title: 'Перемещение записей 3',
    },
    {
        key: 3,
        title: 'Перемещение записей 4',
    },
];

export default class Mover extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _reloadNumber: number = 0;
    protected _itemActions: IItemAction[];
    protected _selectedKeys: CrudEntityKey[];
    protected _filter: { [p: string]: string };
    protected _viewSource: Memory;

    protected _beforeMount() {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data,
        });

        this._itemActions = [
            {
                id: 0,
                icon: 'icon-ArrowUp',
                showType: TItemActionShowType.TOOLBAR,
                handler: (item) => {
                    this._children.listControl
                        .moveItemUp(item.getKey())
                        .then(() => {
                            this._children.listControl.reload();
                        });
                },
            },
            {
                id: 1,
                icon: 'icon-ArrowDown',
                showType: TItemActionShowType.TOOLBAR,
                handler: (item) => {
                    this._children.listControl
                        .moveItemDown(item.getKey())
                        .then(() => {
                            this._children.listControl.reload();
                        });
                },
            },
        ];

        this._selectedKeys = [];
    }
}
