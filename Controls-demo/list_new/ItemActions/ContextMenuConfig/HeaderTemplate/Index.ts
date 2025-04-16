import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import * as template from 'wml!Controls-demo/list_new/ItemActions/ContextMenuConfig/HeaderTemplate/HeaderTemplate';
import 'css!Controls-demo/list_new/ItemActions/ContextMenuConfig/HeaderTemplate/HeaderTemplate';

interface ISrcData {
    key: number;
    title: string;
    itemActions: IItemAction[];
}

const itemActions: IItemAction[] = [
    {
        id: 2,
        icon: 'icon-Erase',
        iconStyle: 'danger',
        title: 'Remove',
        showType: TItemActionShowType.MENU,
    },
];

function getData(): ISrcData[] {
    return [
        {
            key: 1,
            title: 'Кнопка меню будет показана, т.к. указан headerTemplate',
            itemActions,
        },
        {
            key: 2,
            title: 'Кнопка меню будет показана, т.к. указан headerTemplate',
            itemActions: [],
        },
    ];
}

export default class HeaderTemplate extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ItemActionsContextMenuConfigHeaderTemplate1: {
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
