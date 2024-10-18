import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Model } from 'Types/entity';
import { IColumn } from 'Controls/grid';
import { getActionsForContacts as getItemActions } from 'Controls-demo/list_new/DemoHelpers/ItemActionsCatalog';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/gridNew/Nested/Nested';
import * as RootColumnTemplate from 'wml!Controls-demo/gridNew/Nested/RootColumnTemplate';

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

const nestedColumns: IColumn[] = [
    {
        displayProperty: 'title',
        width: '500px',
    },
];

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
    protected _rootColumns: IColumn[];
    protected _lastClickedElement: string;

    protected _beforeMount(
        options?: IControlOptions,
        contexts?: object,
        receivedState?: void
    ): Promise<void> | void {
        this._rootColumns = [
            {
                displayProperty: 'title',
                width: '500px',
                template: RootColumnTemplate,
                templateOptions: {
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

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            Nested: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    markerVisibility: 'hidden'
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
                    markerVisibility: 'hidden',
                },
            },
        };
    }
}
