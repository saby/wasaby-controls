import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { IoC } from 'Env/Env';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import * as template from 'wml!Controls-demo/list_new/ItemActions/ContextMenuConfig/ItemTemplate/ItemTemplate';
import * as downloadTemplate from 'wml!Controls-demo/list_new/ItemActions/ContextMenuConfig/ItemTemplate/_downloadItemTemplate';
import 'css!Controls-demo/list_new/ItemActions/ContextMenuConfig/ItemTemplate/ItemTemplate';

interface IItemActionWithTemplate extends IItemAction {
    menuItemTemplate?: TemplateFunction;
    fileInfo?: {
        prettySize: string;
    };
}

interface ISrcData {
    key: number;
    title: string;
}

const itemActions: IItemActionWithTemplate[] = [
    {
        id: 1,
        icon: 'icon-DownloadNew',
        title: 'Скачать',
        showType: TItemActionShowType.MENU,
        menuItemTemplate: downloadTemplate,
        fileInfo: {
            prettySize: '900 Pb',
        },
        'parent@': null,
        handler(model: Model): void {
            IoC.resolve('ILogger').info('action download Click');
        },
    },
    {
        id: 2,
        icon: 'icon-Erase',
        iconStyle: 'danger',
        title: 'Удалить',
        handler(model: Model): void {
            IoC.resolve('ILogger').info('action delete Click');
        },
    },
];

function getData(): ISrcData[] {
    return [
        {
            key: 1,
            title: 'Кнопка "Скачать" в меню показана при помощи шаблона',
        },
    ];
}

export default class ItemTemplate extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _itemActions: IItemActionWithTemplate[] = itemActions;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData2: {
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
