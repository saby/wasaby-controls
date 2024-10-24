import { Memory } from 'Types/source';
import * as filter from '../DataFilter';
import { View as FilterView } from 'Controls-ListEnv/filterConnected';
import { View as ListView } from 'Controls/list';
import * as React from 'react';

const FilterViewPrimaryDemo = React.forwardRef((props, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper">
            <FilterView storeId="persons" />
            <ListView storeId="persons" />
        </div>
    );
});

// Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
// используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
// https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
FilterViewPrimaryDemo.getLoadConfig = () => {
    return {
        persons: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                source: new Memory({
                    data: [
                        {
                            id: 'Новиков Д.В.',
                            title: 'Новиков Д.В.',
                            department: 'Разработка',
                        },
                        {
                            id: 'Кошелев А.Е.',
                            title: 'Кошелев А.Е.',
                            department: 'Разработка',
                        },
                        {
                            id: 'Субботин А.В.',
                            title: 'Субботин А.В.',
                            department: 'Бухгалтерия',
                        },
                    ],
                    keyProperty: 'id',
                    filter,
                }),
                filterDescription: [
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
                        emptyText: 'Все ответственные',
                        viewMode: 'frequent',
                        primary: true,
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
                displayProperty: 'title',
            },
        },
    };
};

export default FilterViewPrimaryDemo;
