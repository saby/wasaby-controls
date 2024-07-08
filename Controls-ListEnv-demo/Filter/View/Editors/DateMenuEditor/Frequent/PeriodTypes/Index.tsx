import * as React from 'react';
import { View as FilterView } from 'Controls-ListEnv/filterConnected';
import { View as ListView, ItemTemplate } from 'Controls/list';
import { Memory } from 'Types/source';
import * as filter from '../DataFilter';

function CustomItemTemplate(props) {
    return (
        <ItemTemplate {...props}>
            <div>
                <span className="controls-padding_right-m">{props.item.contents.get('title')}</span>
                <span>{props.item.contents.get('date').toLocaleDateString()}</span>
            </div>
        </ItemTemplate>
    );
}

const FrequentDateMenuDemo = React.forwardRef((props, ref) => {
    return (
        <div className="controlsDemo__wrapper" ref={ref}>
            <FilterView storeId="dateMenuData" />
            <ListView storeId="dateMenuData" itemTemplate={CustomItemTemplate} />
        </div>
    );
});

FrequentDateMenuDemo.getLoadConfig = function () {
    return {
        dateMenuData: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                source: new Memory({
                    data: [
                        {
                            id: 'Новиков Д.В.',
                            title: 'Новиков Д.В.',
                            date: new Date(2022, 0, 7),
                        },
                        {
                            id: 'Кошелев А.Е.',
                            title: 'Кошелев А.Е.',
                            date: new Date(2022, 10, 1),
                        },
                        {
                            id: 'Субботин А.В.',
                            title: 'Субботин А.В.',
                            date: new Date(2022, 6, 14),
                        },
                    ],
                    keyProperty: 'id',
                    filter,
                }),
                keyProperty: 'id',
                displayProperty: 'title',
                filterDescription: [
                    {
                        caption: 'Период',
                        name: 'dateRange',
                        editorTemplateName: 'Controls/filterPanelEditors:DateMenu',
                        viewMode: 'frequent',
                        textValue: 'Весь период',
                        value: null,
                        emptyText: 'Весь период',
                        type: 'dateMenu',
                        editorOptions: {
                            closeButtonVisibility: 'hidden',
                            excludedPeriods: ['quarter'],
                            userPeriods: [
                                {
                                    key: 'Overdue',
                                    title: 'Просроченные',
                                },
                            ],
                            _date: new Date(2022, 10, 1), // только для тестов, чтобы замокать текущий день
                            displayProperty: 'title',
                            keyProperty: 'id',
                            type: 'last',
                        },
                    },
                    {
                        name: 'response',
                        value: null,
                        resetValue: null,
                        editorOptions: {
                            source: new Memory({
                                keyProperty: 'id',
                                data: [
                                    {
                                        id: 'Новиков Д.В.',
                                        title: 'Новиков Д.В.',
                                    },
                                    {
                                        id: 'Кошелев А.Е.',
                                        title: 'Кошелев А.Е.',
                                    },
                                    {
                                        id: 'Субботин А.В.',
                                        title: 'Субботин А.В.',
                                    },
                                ],
                            }),
                            displayProperty: 'title',
                            keyProperty: 'id',
                        },
                        viewMode: 'frequent',
                    },
                    {
                        name: 'department',
                        value: null,
                        resetValue: null,
                        editorOptions: {
                            source: new Memory({
                                keyProperty: 'id',
                                data: [
                                    {
                                        id: 'Разработка',
                                        title: 'Разработка',
                                    },
                                    {
                                        id: 'Бухгалтерия',
                                        title: 'Бухгалтерия',
                                    },
                                ],
                            }),
                            displayProperty: 'title',
                            keyProperty: 'id',
                        },
                        viewMode: 'frequent',
                    },
                ],
            },
        },
    };
};

export default FrequentDateMenuDemo;
