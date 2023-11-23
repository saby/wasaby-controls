import * as React from 'react';
import { dropdownConfig } from 'Controls-ListEnv-demo/FilterPanel/View/Editors/DropdownEditor/Index';
import { lookupBasicConfig } from 'Controls-ListEnv-demo/Filter/View/Editors/LookupEditor/MultiSelect/Index';
import { Memory } from 'Types/source';
import { sourceData } from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import { View as FilterView } from 'Controls-ListEnv/filterConnected';
import { IColumn, IHeaderCell, View as GridControl } from 'Controls/grid';
import { Title } from 'Controls/heading';
import * as filter from './Filter';
import 'css!Controls-ListEnv-demo/Filter/filter';

const columns: IColumn[] = [
    {
        displayProperty: 'department',
    },
    {
        displayProperty: 'owner',
    },
    {
        displayProperty: 'salary',
    },
    {
        displayProperty: 'city',
    },
    {
        displayProperty: 'date',
    },
];

const header: IHeaderCell[] = [
    { caption: 'Отдел' },
    { caption: 'Руководитель' },
    { caption: 'Зарплата' },
    { caption: 'Город' },
    { caption: 'Дата' },
];

function FilterWithLists(props: unknown, ref: React.ForwardedRef<unknown>): JSX.Element {
    return (
        <div className={'engine-demo__Widgets_scroll'} ref={ref}>
            <div className={'engine-demo__Widgets_filter-container'}>
                <div>
                    <FilterView storeId={'filter'} />
                    <div className={'ws-flexbox'}>
                        <div>
                            <Title caption={'Список, который фильтрует только по подразделению'} />
                            <GridControl storeId={'department'} columns={columns} header={header} />
                        </div>
                        <div>
                            <Title caption={'Список, который фильтрует только по городу'} />
                            <GridControl storeId={'city'} columns={columns} header={header} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const forwardedDemo = React.forwardRef(FilterWithLists);

forwardedDemo.getLoadConfig = function () {
    return {
        filter: {
            dataFactoryName: 'Controls-ListEnv/filterDataFactory:Factory',
            dataFactoryArguments: {
                filterDescription: [...[dropdownConfig, lookupBasicConfig]],
            },
        },
        city: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                clearResult: true,
                sliceExtraValues: [
                    {
                        propName: 'filterDescription',
                        dependencyName: 'filter',
                        dependencyPropName: 'filterDescription',
                        prepare: function (filterDescription) {
                            return filterDescription.filter((filterItem) => {
                                return filterItem.name === 'city';
                            });
                        },
                    },
                ],
                loaderExtraValues: [
                    {
                        propName: 'filterDescription',
                        dependencyName: 'filter',
                        dependencyPropName: 'filterDescription',
                        prepare: function (filterDescription) {
                            return filterDescription.filter((filterItem) => {
                                return filterItem.name === 'city';
                            });
                        },
                    },
                ],
                keyProperty: 'department',
                displayProperty: 'title',
                source: new Memory({
                    data: sourceData,
                    keyProperty: 'department',
                    filter,
                }),
            },
        },
        department: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                clearResult: true,
                sliceExtraValues: [
                    {
                        propName: 'filterDescription',
                        dependencyName: 'filter',
                        dependencyPropName: 'filterDescription',
                        prepare: function (filterDescription) {
                            return filterDescription.filter((filterItem) => {
                                return filterItem.name === 'department';
                            });
                        },
                    },
                ],
                loaderExtraValues: [
                    {
                        propName: 'filterDescription',
                        dependencyName: 'filter',
                        dependencyPropName: 'filterDescription',
                        prepare: function (filterDescription) {
                            return filterDescription.filter((filterItem) => {
                                return filterItem.name === 'department';
                            });
                        },
                    },
                ],
                keyProperty: 'department',
                displayProperty: 'title',
                source: new Memory({
                    data: sourceData,
                    keyProperty: 'department',
                    filter,
                }),
            },
        },
    };
};

export default forwardedDemo;
