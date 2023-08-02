import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import * as Template from 'wml!Controls-demo/list_new/MoveController/Base/Base';

function getData() {
    return [
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
}

export default class Mover extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _itemActions: IItemAction[];

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

    protected _beforeMount() {
        this._itemActions = [
            {
                id: 0,
                icon: 'icon-ArrowUp',
                showType: TItemActionShowType.TOOLBAR,
                handler: (item) => {
                    this._children.listControl.moveItemUp(item.getKey()).then(() => {
                        this._children.listControl.reload();
                    });
                },
            },
            {
                id: 1,
                icon: 'icon-ArrowDown',
                showType: TItemActionShowType.TOOLBAR,
                handler: (item) => {
                    this._children.listControl.moveItemDown(item.getKey()).then(() => {
                        this._children.listControl.reload();
                    });
                },
            },
        ];
    }
}
