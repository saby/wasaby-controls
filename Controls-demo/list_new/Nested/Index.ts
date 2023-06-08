import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Model } from 'Types/entity';
import { IItemAction } from 'Controls/itemActions';

import * as Template from 'wml!Controls-demo/list_new/Nested/Nested';
import { getActionsWithSVG as getItemActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return [
        {
            key: 1,
            group: 'Группа верхнего уровня',
            title: 'Запись списка верхнего уровня. В шаблоне содержится вложенный список',
        },
    ];
}

function getNestedData() {
    return [
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
}

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _lastClickedElement: string;
    protected _nestedItemActions: IItemAction[];

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
                    markerVisibility: 'hidden',
                },
            },
            nestedListData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getNestedData(),
                    }),
                },
            },
        };
    }

    protected _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
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
