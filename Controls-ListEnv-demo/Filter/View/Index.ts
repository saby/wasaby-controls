import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/Filter/View/Index';
import { Memory } from 'Types/source';
import {
    listData,
    namesFilterData,
    cityFilterData,
} from 'Controls-ListEnv-demo/Filter/resources/Data';
import { IColumn, IHeaderCell } from 'Controls/grid';
import * as filter from './DataFilter';

export default class WidgetWrapper extends Control<IControlOptions, void> {
    protected _template: TemplateFunction = template;
    protected _columns: IColumn[] = [{ displayProperty: 'name' }, { displayProperty: 'city' }];
    protected _header: IHeaderCell[] = [{ caption: 'Имя' }, { caption: 'Город проживания' }];

    static getLoadConfig(): unknown {
        return {
            persons: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    keyProperty: 'id',
                    root: null,
                    source: new Memory({
                        keyProperty: 'id',
                        data: listData,
                        filter,
                    }),
                    filterButtonSource: [
                        {
                            name: 'name',
                            group: 'Имя',
                            value: null,
                            resetValue: null,
                            viewMode: 'basic',
                            emptyText: 'Все сотрудники',
                            textValue: '',
                            editorTemplateName: 'Controls/filterPanelEditors:Dropdown',
                            editorOptions: {
                                source: new Memory({
                                    data: WidgetWrapper.getFilterItems(
                                        namesFilterData,
                                        'Все сотрудники',
                                        'name'
                                    ),
                                    keyProperty: 'id',
                                }),
                                keyProperty: 'id',
                                displayProperty: 'title',
                            },
                        },
                        {
                            name: 'city',
                            group: 'Город',
                            value: null,
                            resetValue: null,
                            emptyText: 'Все города',
                            viewMode: 'basic',
                            textValue: '',
                            editorTemplateName: 'Controls/filterPanelEditors:Dropdown',
                            editorOptions: {
                                source: new Memory({
                                    data: WidgetWrapper.getFilterItems(
                                        cityFilterData,
                                        'Все города',
                                        'city'
                                    ),
                                    keyProperty: 'id',
                                }),
                                keyProperty: 'id',
                                displayProperty: 'title',
                            },
                        },
                    ],
                },
            },
        };
    }

    static getFilterItems(
        filterItems: object[],
        emptyText: string,
        displayProperty: string
    ): object[] {
        const items = [
            {
                id: null,
                title: emptyText,
            },
        ];
        filterItems.forEach((item) => {
            items.push({
                id: item[displayProperty],
                title: item[displayProperty],
            });
        });
        return items;
    }
}
