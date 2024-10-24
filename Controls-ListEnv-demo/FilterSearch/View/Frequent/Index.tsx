import * as React from 'react';
import { View } from 'Controls-ListEnv/filterSearchConnected';
import { Memory } from 'Types/source';
import { companies } from 'Controls-ListEnv-demo/Filter/NotConnectedView/resources/DataStorage';
import { BooleanEditorConfig } from 'Controls-ListEnv-demo/Filter/View/Editors/BooleanEditor/Index';
import { lookupInputConfig } from 'Controls-ListEnv-demo/Filter/View/Editors/LookupInputEditor/Index';
import { dropdownConfig } from 'Controls-ListEnv-demo/Filter/View/Editors/DropdownEditor/Index';
import 'css!Controls-ListEnv-demo/FilterSearch/filter';

const SEARCH_FILTER_NAMES = ['employee'];
const FILTER_NAMES = ['ourOrganisation', 'owner', 'booleanEditor', 'capital'];

const FilterSearchDemo = React.forwardRef((props, ref) => {
    return (
        <div
            className="controlsDemo__wrapper controls-ListEnv-demo-FilterSearch-maxWidth"
            ref={ref}
        >
            <View
                storeId="dateMenuData"
                searchParam="title"
                searchFilterNames={SEARCH_FILTER_NAMES}
                filterNames={FILTER_NAMES}
                alignment={'right'}
                contrastBackground={true}
            />
        </div>
    );
});

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
                        name: 'ourOrganisation',
                        value: null,
                        resetValue: null,
                        textValue: '',
                        viewMode: 'frequent',
                        caption: 'Вся компания',
                        emptyText: 'Вся компания',
                        editorTemplateName: 'Controls/filterPanelEditors:Lookup',
                        editorOptions: {
                            selectorTemplate: {
                                templateName:
                                    'Controls-demo/Input/Lookup/FlatListSelector/FlatListSelector',
                                templateOptions: {
                                    source: new Memory({
                                        data: companies,
                                        keyProperty: 'id',
                                    }),
                                },
                            },
                            suggestTemplateName:
                                'Controls-demo/Input/Lookup/Suggest/SuggestTemplate',
                            className: 'controls-demo-FilterView__lookupTemplate',
                            keyProperty: 'id',
                            displayProperty: 'title',
                            source: new Memory({
                                data: companies,
                                keyProperty: 'id',
                            }),
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
