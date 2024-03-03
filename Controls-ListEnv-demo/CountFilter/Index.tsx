import { RecordSet } from 'Types/collection';
import * as React from 'react';
import { Memory } from 'Types/source';
import { Base as MasterDetailBase } from 'Controls/masterDetail';
import { View as FilterView } from 'Controls-ListEnv/filterConnected';
import { View as FilterPanel } from 'Controls-ListEnv/filterPanelConnected';
import { View as ListView } from 'Controls/list';
import DataSource from 'Controls-ListEnv-demo/CountFilter/DataSource';
import * as filter from 'Controls-ListEnv-demo/CountFilter/ListDataFilter';
import 'css!Controls-ListEnv-demo/FilterPanel/filterPanel';
import { responsibleData } from 'Controls-ListEnv-demo/Filter/NotConnectedView/resources/DataStorage';

const FILTER_VIEW_NAMES = ['date'];

const filterData = [
    {
        id: 'Task',
        title: 'Задача в разработку',
        stage: 'complete',
        count: 135,
    },
    {
        id: 'Error',
        title: 'Ошибка',
        stage: 'work',
        count: 401,
    },
    {
        id: 'Instruction',
        title: 'Поручение',
        stage: 'testing',
        count: 38,
    },
    {
        id: 'Review',
        title: 'Ревью кода',
        stage: 'check',
        count: 22,
    },
    {
        id: 'Doc',
        title: 'Изменение документации',
        stage: 'work',
        count: 155,
    },
];

const listItem = {
    name: 'task',
    editorTemplateName: 'Controls/filterPanel:ListEditor',
    resetValue: null,
    viewMode: 'basic',
    value: null,
    editorOptions: {
        titleTemplateName: 'Controls-ListEnv-demo/CountFilter/FilterCounterTemplate',
        source: new DataSource({
            data: filterData,
        }),
        additionalTextProperty: 'count',
        displayProperty: 'title',
        keyProperty: 'id',
        emptyKey: null,
        emptyText: 'Все',
        markerStyle: 'primary',
    },
};

const stageItem = {
    name: 'stage',
    editorTemplateName: 'Controls/filterPanel:ListEditor',
    resetValue: null,
    viewMode: 'basic',
    value: null,
    caption: 'Этап',
    editorOptions: {
        source: new Memory({
            data: [
                {
                    id: 'complete',
                    title: 'Завершено',
                },
                {
                    id: 'work',
                    title: 'В работе',
                },
                {
                    id: 'testing',
                    title: 'На тестировании',
                },
                {
                    id: 'check',
                    title: 'На проверке',
                },
            ],
            keyProperty: 'id',
        }),
        displayProperty: 'title',
        keyProperty: 'id',
    },
};

const dateRangeItem = {
    caption: 'Период',
    name: 'date',
    type: 'dateRange',
    editorTemplateName: 'Controls/filterPanelEditors:DateRange',
    resetValue: [null, null],
    viewMode: 'frequent',
    value: [null, null],
    editorOptions: {
        emptyCaption: 'Период',
        resetStartValue: null,
        resetEndValue: null,
    },
};

function FilterCountDemo(_, ref) {
    return (
        <div ref={ref} className="controlsDemo__wrapper-background">
            <div className="ws-flexbox ws-align-items-center ws-justify-content-between">
                <FilterView
                    storeId="rating"
                    filterNames={FILTER_VIEW_NAMES}
                    className="engine-demo__Widgets__filter-padding"
                />
            </div>
            <div className="ws-flexbox">
                <MasterDetailBase
                    masterWidth={200}
                    newDesign={true}
                    className="engine-demo__Widgets_list"
                    master={MasterTemplate}
                    detail={DetailTemplate}
                />
            </div>
        </div>
    );
}

const filterNames = ['task', 'stage'];

function MasterTemplate(props): JSX.Element {
    return <FilterPanel storeId="rating" filterNames={filterNames} />;
}

function DetailTemplate(props): JSX.Element {
    return (
        <div
            className={`"ws-flexbox ws-flex-column engine-demo__Widgets_list ${props.attrs?.className}`}
        >
            <ListView className="tw-h-full" storeId="rating" {...props} />
        </div>
    );
}

const forwardedFilterCountDemo = React.forwardRef(FilterCountDemo);
// Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
// используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
// https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
// @ts-ignore
forwardedFilterCountDemo.getLoadConfig = function () {
    return {
        rating: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                source: new Memory({
                    keyProperty: 'id',
                    data: filterData,
                    filter,
                }),
                displayProperty: 'title',
                filterDescription: [listItem, stageItem, dateRangeItem],
            },
        },
    };
};
export default forwardedFilterCountDemo;
