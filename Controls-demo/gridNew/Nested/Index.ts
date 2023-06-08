import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { Memory } from 'Types/source';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Model } from 'Types/entity';
import { IColumn } from 'Controls/grid';
import { getActionsForContacts as getItemActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';

import * as Template from 'wml!Controls-demo/gridNew/Nested/Nested';
import * as RootColumnTemplate from 'wml!Controls-demo/gridNew/Nested/RootColumnTemplate';

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

const nestedColumns: IColumn[] = [
    {
        displayProperty: 'title',
        width: '500px',
    },
];

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _rootSource: Memory;
    protected _nestedSource: Memory;
    protected _rootColumns: IColumn[];
    protected _nestedColumns: IColumn[] = nestedColumns;
    protected _lastClickedElement: string;

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
        this._rootColumns = [
            {
                displayProperty: 'title',
                width: '500px',
                template: RootColumnTemplate,
                templateOptions: {
                    nestedSource: this._nestedSource,
                    nestedColumns,
                    nestedItemActions: getItemActions(),
                },
            },
        ];
    }

    protected _groupClick(
        e: SyntheticEvent,
        item: Model | string,
        originalEvent: SyntheticEvent
    ): void {
        this._lastClickedElement = item as string;
    }
}
