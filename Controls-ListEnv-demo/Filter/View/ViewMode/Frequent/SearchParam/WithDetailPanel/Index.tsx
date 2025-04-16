import * as React from 'react';
import { View as FilterView } from 'Controls-ListEnv/filterConnected';
import { View as ListView } from 'Controls/list';
import { Memory } from 'Types/source';
import * as filter from '../../resources/DataFilter';
import { searchFilterFrequentConfig } from '../Index';
import { dropdownBasicConfig } from 'Controls-ListEnv-demo/FilterPanel/View/Editors/DropdownEditor/Index';

const WithDetailPanelSearchDemo = React.forwardRef(function (_, ref) {
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
WithDetailPanelSearchDemo.getLoadConfig = () => {
    return {
        persons: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                source: new Memory({
                    data: [
                        { id: 'Новиков Д.В.', title: 'Новиков Д.В.' },
                        { id: 'Кошелев А.Е.', title: 'Кошелев А.Е.' },
                        { id: 'Субботин А.В.', title: 'Субботин А.В.' },
                    ],
                    keyProperty: 'id',
                    filter,
                }),
                filterDescription: [
                    {
                        ...searchFilterFrequentConfig,
                        editorTemplateName: 'Controls/filterPanelEditors:Dropdown',
                        caption: 'Сайт',
                        editorOptions: {
                            ...searchFilterFrequentConfig.editorOptions,
                            emptyText: 'Все',
                        },
                    },
                    { ...dropdownBasicConfig, value: 'Разработка' },
                ],
                displayProperty: 'title',
            },
        },
    };
};

export default WithDetailPanelSearchDemo;
