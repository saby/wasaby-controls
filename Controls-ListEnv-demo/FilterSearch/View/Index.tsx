import * as React from 'react';
import { View } from 'Controls-ListEnv/filterSearchConnected';
import { Memory } from 'Types/source';
import { BooleanEditorConfig } from 'Controls-ListEnv-demo/Filter/View/Editors/BooleanEditor/Index';
import { lookupInputConfig } from 'Controls-ListEnv-demo/Filter/View/Editors/LookupInputEditor/Index';
import { dropdownConfig } from 'Controls-ListEnv-demo/Filter/View/Editors/DropdownEditor/Index';
import SearchMemory from 'Controls-ListEnv-demo/ExtSearch/resources/SearchMemory';
import { companyData } from 'Controls-ListEnv-demo/ExtSearch/resources/Source';

const SEARCH_FILTER_NAMES = ['employee', 'company'];
const FILTER_NAMES = ['owner', 'booleanEditor', 'capital'];

const FilterSearchDemo = React.forwardRef((props, ref) => {
    return (
        <div className="controlsDemo__wrapper" ref={ref}>
            <View
                storeId="dateMenuData"
                searchParam="title"
                searchFilterNames={SEARCH_FILTER_NAMES}
                filterNames={FILTER_NAMES}
            />
        </div>
    );
});

const navigation = {
    source: 'page',
    view: 'page',
    sourceConfig: {
        pageSize: 5,
        page: 0,
        hasMore: false,
    },
};

const searchInputSettings = [
    { id: 'fio', title: 'ФИО / Название отдела' },
    { id: 'id', title: 'Идентификатор / Код отдела' },
    { id: 'staffId', title: 'Табельный номер' },
    { id: 'inn', title: 'ИНН' },
    { id: 'fio', title: 'Телефон' },
    { id: 'email', title: 'e-mail' },
    { id: 'login', title: 'Логин' },
    { id: 'snils', title: 'Снилс' },
];

FilterSearchDemo.getLoadConfig = function () {
    return {
        dateMenuData: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                source: new Memory({
                    data: [],
                    keyProperty: 'id',
                }),
                keyProperty: 'id',
                historyId: 'DEMO_FILTER_VIEW_DATE_MENU_ITEMS_HISTORY_ID',
                displayProperty: 'title',
                searchParam: 'title',
                filterDescription: [
                    // Настройки в строке поиска
                    {
                        name: 'employee',
                        resetValue: [],
                        value: [],
                        textValue: '',
                        editorTemplateName:
                            'Controls-ListEnv/filterPanelExtEditors:CheckboxGroupEditor',
                        editorOptions: {
                            multiSelect: true,
                            direction: 'horizontal',
                            keyProperty: 'id',
                            displayProperty: 'title',
                            source: new Memory({
                                data: searchInputSettings,
                                keyProperty: 'id',
                            }),
                        },
                    },
                    {
                        name: 'company',
                        type: 'list',
                        value: null,
                        resetValue: null,
                        caption: 'Компании',
                        viewMode: 'basic',
                        editorTemplateName: 'Controls/filterPanelEditors:Lookup',
                        editorOptions: {
                            source: new SearchMemory({
                                keyProperty: 'id',
                                data: companyData,
                            }),
                            navigation,
                            displayProperty: 'title',
                            keyProperty: 'id',
                        },
                    },
                    BooleanEditorConfig,
                    lookupInputConfig,
                    dropdownConfig,
                ],
            },
        },
    };
};

export default FilterSearchDemo;
