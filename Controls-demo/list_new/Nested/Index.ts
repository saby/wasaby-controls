import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { Memory } from 'Types/source';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Model } from 'Types/entity';
import { IItemAction } from 'Controls/itemActions';

import * as Template from 'wml!Controls-demo/list_new/Nested/Nested';
import { getActionsWithSVG as getItemActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';

const rootData = [
    {
        key: 1,
        group: 'Группа верхнего уровня',
        title: 'Запись списка верхнего уровня. В шаблоне содержится вложенный список',
    },
];

const nestedData = [
    {
        key: 1,
        group: 'Группа #1 вложенного списка',
        title: 'Запись #1 вложенного списка',
    },
    {
        key: 2,
        group: 'Группа #1 вложенного списка',
        title: 'Запись #2 вложенного списка',
    },
    {
        key: 3,
        group: 'Группа #2 вложенного списка',
        title: 'Запись #3 вложенного списка',
    },
    {
        key: 4,
        group: 'Группа #2 вложенного списка',
        title: 'Запись #4 вложенного списка',
    },
];

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _rootSource: Memory;
    protected _nestedSource: Memory;
    protected _lastClickedElement: string;
    protected _nestedItemActions: IItemAction[];

    protected _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._rootSource = new Memory({
            keyProperty: 'key',
            data: rootData,
        });
        this._nestedSource = new Memory({
            keyProperty: 'key',
            data: nestedData,
        });
        this._nestedItemActions = getItemActions();
    }

    protected _groupClick(
        e: SyntheticEvent,
        item: Model | string,
        originalEvent: SyntheticEvent
    ): void {
        this._lastClickedElement = item as string;
    }
}
