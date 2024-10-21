import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { Memory } from 'Types/source';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import Nested from './Tile/Tile';

import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/PreviewTemplate/Nested/Nested';

const listItemActions: IItemAction[] = [
    {
        id: 1,
        title: 'Прочитано',
        showType: TItemActionShowType.TOOLBAR,
    },
    {
        id: 2,
        icon: 'icon-PhoneNull',
        title: 'Позвонить',
        showType: TItemActionShowType.MENU_TOOLBAR,
    },
];

function getData() {
    return [
        {
            key: 1,
            title: 'Запись списка верхнего уровня. В шаблоне содержится вложенная плитка',
        },
    ];
}

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _listItemActions: IItemAction[] = listItemActions;

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
            ...Nested.getLoadConfig(),
        };
    }
}
