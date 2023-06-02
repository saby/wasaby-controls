import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/Filter/CompatibleView/Index';
import { Memory } from 'Types/source';
import { IFilterItem } from 'Controls/filter';
import {
    listData,
    namesFilterData,
    cityFilterData,
} from 'Controls-ListEnv-demo/Filter/resources/Data';
import {
    IDataConfig,
    IListDataFactoryArguments,
} from 'Controls-DataEnv/dataFactory';
import * as filter from './DataFilter';

function getFilterItems(
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
};

export default class WidgetWrapper extends Control<IControlOptions, void> {
    protected _template: TemplateFunction = template;

    static getLoadConfig(): Record<
        string,
        IDataConfig<IListDataFactoryArguments>
        > {
        return {
            filterView: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: listData,
                        keyProperty: 'id',
                        filter,
                    }),
                    keyProperty: 'id',
                    displayProperty: 'title',
                    root: null,
                    filterDescription: [
                        {
                            name: 'name',
                            group: 'Имя',
                            value: null,
                            resetValue: null,
                            viewMode: 'basic',
                            emptyText: 'Все сотрудники',
                            textValue: '',
                            itemTemplate:
                                'wml!Controls-ListEnv-demo/Filter/CompatibleView/Dropdown',
                            editorOptions: {
                                source: new Memory({
                                    data: getFilterItems(
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
                            itemTemplate:
                                'wml!Controls-ListEnv-demo/Filter/CompatibleView/Dropdown',
                            editorOptions: {
                                source: new Memory({
                                    data: getFilterItems(
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
                    ] as IFilterItem[],
                },
            },
        };
    }
}
