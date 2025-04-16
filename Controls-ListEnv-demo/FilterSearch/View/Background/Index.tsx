import * as React from 'react';
import { View } from 'Controls-ListEnv/filterSearchConnected';
import { Memory } from 'Types/source';
import { BooleanEditorConfig } from 'Controls-ListEnv-demo/Filter/View/Editors/BooleanEditor/Index';
import { lookupInputConfig } from 'Controls-ListEnv-demo/Filter/View/Editors/LookupInputEditor/Index';
import { dropdownConfig } from 'Controls-ListEnv-demo/Filter/View/Editors/DropdownEditor/Index';
import { tagEditorConfig } from 'Controls-ListEnv-demo/Filter/View/Editors/TagEditor/Index';
import SearchMemory from 'Controls-ListEnv-demo/ExtSearch/resources/SearchMemory';
import { companyData } from 'Controls-ListEnv-demo/ExtSearch/resources/Source';
import 'css!Controls-ListEnv-demo/FilterSearch/View/Background/index';

const SEARCH_FILTER_NAMES = ['company'];
const FILTER_NAMES = ['owner', 'booleanEditor', 'capital', 'tags'];

const FilterSearchDemo = React.forwardRef((props, ref) => {
    return (
        <div className="controlsDemo__wrapper controlsDemo__maxWidth500" ref={ref}>
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
                    tagEditorConfig,
                    BooleanEditorConfig,
                    lookupInputConfig,
                    dropdownConfig,
                ],
            },
        },
    };
};

export default FilterSearchDemo;
