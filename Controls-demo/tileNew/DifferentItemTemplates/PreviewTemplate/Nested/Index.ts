import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { Memory } from 'Types/source';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';

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

const rootData = [
    {
        key: 1,
        title: 'Запись списка верхнего уровня. В шаблоне содержится вложенная плитка',
    },
];

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _listItemActions: IItemAction[] = listItemActions;
    protected _rootSource: Memory;

    protected _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._rootSource = new Memory({
            keyProperty: 'key',
            data: rootData,
        });
    }
}
