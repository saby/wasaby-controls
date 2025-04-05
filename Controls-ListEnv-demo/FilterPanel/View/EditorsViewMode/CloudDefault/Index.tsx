import * as React from 'react';
import { View as FilterPanel } from 'Controls-ListEnv/filterPanelConnected';
import { View as FilterView } from 'Controls-ListEnv/filterConnected';
import { View as ExplorerView } from 'Controls/explorer';
import { Memory } from 'Types/source';
import {
    bigListOfDepartments,
    owners,
    sourceData,
} from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import * as filter from 'Controls-ListEnv-demo/FilterPanel/View/EditorsViewMode/CloudDefault/DataFilter';
import { lookupConfig } from 'Controls-ListEnv-demo/FilterPanel/View/Editors/LookupEditor/SelectorMode/Index';
import { listWithPhoto } from 'Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/WithPhoto/Index';
import { dropdownConfig } from 'Controls-ListEnv-demo/Filter/View/Editors/DropdownEditor/Index';
import 'css!Controls-ListEnv-demo/FilterPanel/filterPanel';

const EXCLUDED_FILTER_NAMES = ['department'];
const FILTER_NAMES = ['owner', 'department', 'city', 'isDevelopment'];
const MIN_WIDTH = {
    'min-width': '200px',
};

const nomenclatureHeader = [
    { caption: 'Название' },
    { caption: 'Страна' },
    { caption: 'Тип' },
    { caption: 'Тип экрана' },
    { caption: 'Производитель' },
    { caption: 'Наличие' },
];
const columns = [
    { displayProperty: 'title', width: '150px' },
    { displayProperty: 'country' },
    { displayProperty: 'type' },
    { displayProperty: 'screenType' },
    { displayProperty: 'company' },
    { displayProperty: 'available' },
];

function WidgetWrapper(props, ref) {
    return (
        <div ref={ref} className="controls-margin-m tw-flex">
            <div className="tw-flex tw-flex-col" style={MIN_WIDTH}>
                <div>
                    <FilterView
                        storeId="cloudDefault"
                        excludedFilterNames={EXCLUDED_FILTER_NAMES}
                    />
                </div>
                <div className="tw-flex tw-flex-col">
                    <FilterPanel storeId="cloudDefault" filterNames={FILTER_NAMES} />
                </div>
            </div>
            <ExplorerView storeId="cloudDefault" columns={columns} header={nomenclatureHeader} />
        </div>
    );
}

const WidgetWrapperRef = React.forwardRef(WidgetWrapper);

WidgetWrapperRef.getLoadConfig = () => {
    return {
        cloudDefault: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                source: new Memory({
                    data: sourceData,
                    keyProperty: 'department',
                    filter,
                }),
                displayProperty: 'title',
                keyProperty: 'department',
                editorsViewMode: 'cloud|default',
                filterDescription: [
                    {
                        ...listWithPhoto,
                        emptyText: 'Все',
                        emptyKey: null,
                        editorOptions: {
                            ...listWithPhoto.editorOptions,
                            selectorTemplate: {
                                templateName:
                                    'Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/MarkerStyle/MultiSelectStackTemplate/StackTemplate',
                                templateOptions: { items: bigListOfDepartments },
                                popupOptions: {
                                    width: 500,
                                },
                            },
                        },
                    },
                    {
                        name: 'owner',
                        caption: 'Руководитель',
                        editorTemplateName: 'Controls/filterPanel:ListEditor',
                        resetValue: [],
                        value: [],
                        textValue: '',
                        editorOptions: {
                            selectorTemplate: {
                                templateName:
                                    'Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/MarkerStyle/MultiSelectStackTemplate/StackTemplate',
                                templateOptions: { items: owners },
                                popupOptions: {
                                    width: 500,
                                },
                            },
                            searchParam: 'title',
                            suggestTemplate: {
                                templateName: 'Controls/suggestPopup:SuggestTemplate',
                            },
                            source: new Memory({
                                keyProperty: 'id',
                                data: owners,
                            }),
                            displayProperty: 'title',
                            keyProperty: 'id',
                            multiSelect: true,
                        },
                    },
                    { ...lookupConfig, caption: 'Город', expanderVisible: true },
                    { ...dropdownConfig, expanderVisible: true },
                ],
            },
        },
    };
};

export default WidgetWrapperRef;
