import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import * as template from 'wml!Controls-demo/list_new/ItemActions/ContextMenuConfig/FooterTemplate/FooterTemplate';
import 'css!Controls-demo/list_new/ItemActions/ContextMenuConfig/FooterTemplate/FooterTemplate';

interface ISrcData {
    key: number;
    title: string;
    menuFooterText: string;
    itemActions: IItemAction[];
}

const itemActions: IItemAction[] = [
    {
        id: 'delete',
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
            title: 'Кнопка меню будет показана, т.к. указан footerTemplate',
            menuFooterText:
                'В шаблоне footerTemplate может быть размещена дополнительная информация',
            itemActions,
        },
        {
            key: 2,
            title: 'Кнопка меню будет показана, т.к. указан footerTemplate',
            menuFooterText:
                'В шаблоне footerTemplate может быть размещена дополнительная информация',
            itemActions: [],
        },
    ];
}

export default class FooterTemplate extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ItemActionsContextMenuConfigFooterTemplate0: {
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
