import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { IoC } from 'Env/Env';

import * as template from 'wml!Controls-demo/list_new/ItemActions/ContextMenuConfig/FooterTemplate/FooterTemplate';

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
        handler(model: Model): void {
            IoC.resolve('ILogger').info('action delete Click');
        },
    },
];

const data: ISrcData[] = [
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

export default class FooterTemplate extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _viewSource: Memory;

    protected _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data,
        });
    }

    static _styles: string[] = [
        'Controls-demo/list_new/ItemActions/ContextMenuConfig/FooterTemplate/FooterTemplate',
    ];
}
