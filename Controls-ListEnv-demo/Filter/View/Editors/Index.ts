import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/Filter/View/Editors/Index';
import { Memory } from 'Types/source';
import * as dataFilter from './DataFilter';
import {
    departments,
    sourceData,
} from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import {
    dateConfig,
    dateBasicConfig,
} from 'Controls-ListEnv-demo/FilterPanel/View/Editors/DateEditor/Index';
import {
    dateRangeConfig,
    dateRangeBasicConfig,
} from 'Controls-ListEnv-demo/FilterPanel/View/Editors/DateRangeEditor/Index';
import {
    dateMenuConfig,
    dateMenuBasicConfig,
    simpleDateMenuBasicConfig,
} from 'Controls-ListEnv-demo/Filter/View/Editors/DateMenuEditor/Index';
import {
    dropdownConfig,
    dropdownBasicConfig,
} from 'Controls-ListEnv-demo/FilterPanel/View/Editors/DropdownEditor/Index';
import {
    textConfig,
    textBasicConfig,
} from 'Controls-ListEnv-demo/FilterPanel/View/Editors/TextEditor/Index';
import { tumblerConfig } from 'Controls-ListEnv-demo/FilterPanel/View/Editors/TumblerEditor/Index';
import {
    lookupConfig,
    lookupBasicConfig,
} from 'Controls-ListEnv-demo/Filter/View/Editors/LookupEditor/MultiSelect/Index';
import {
    lookupInputConfig,
    lookupInputBasicConfig,
} from 'Controls-ListEnv-demo/Filter/View/Editors/LookupInputEditor/Index';
import { radioGroupConfig } from 'Controls-ListEnv-demo/Filter/View/Editors/RadioGroupEditor/Index';
import {
    numberRangeConfig,
    numberRangeBasicConfig,
} from 'Controls-ListEnv-demo/FilterPanel/View/Editors/NumberRangeEditor/Index';
import {
    inputConfig,
    inputBasicConfig,
} from 'Controls-ListEnv-demo/Filter/View/Editors/InputEditor/Index';
import { IColumn, IHeaderCell } from 'Controls/grid';
import 'Controls-ListEnv-demo/Filter/View/resources/HistorySourceDemo';
import 'css!Controls-ListEnv-demo/Filter/filter';

const VERTICAL_BUTTON_CAPTION = 'Switch to horizontal';
const HORIZONTAL_BUTTON_CAPTION = 'Switch to vertical';

const commonFilters = [
    {
        caption: 'Дата создания',
        name: 'createDateEditor',
        editorTemplateName: 'Controls/filterPanel:DateEditor',
        resetValue: null,
        viewMode: 'extended',
        value: null,
        textValue: '',
        editorOptions: {
            closeButtonVisibility: 'hidden',
            extendedCaption: 'Дата создания',
        },
    },
    {
        caption: 'Период создания',
        name: 'createDateRangeEditor',
        editorTemplateName: 'Controls/filterPanel:DateRangeEditor',
        resetValue: [],
        viewMode: 'extended',
        value: [],
        textValue: '',
        editorOptions: {
            extendedCaption: 'Период создания',
        },
    },
    {
        caption: 'Меню городов',
        name: 'cityDropdown',
        value: ['Moscow'],
        resetValue: [null],
        viewMode: 'basic',
        textValue: '',
        editorTemplateName: 'Controls/filterPanel:DropdownEditor',
        editorOptions: {
            source: new Memory({
                data: [
                    { id: 'Yaroslavl', title: 'Yaroslavl' },
                    { id: 'Moscow', title: 'Moscow' },
                    { id: 'Kazan', title: 'Kazan' },
                ],
                keyProperty: 'id',
            }),
            selectedAllText: 'Все города',
            multiSelect: true,
            keyProperty: 'id',
            displayProperty: 'title',
        },
    },
    {
        caption: 'Меню пол',
        name: 'genderDropdown',
        value: null,
        resetValue: null,
        textValue: '',
        editorTemplateName: 'Controls/filterPanel:DropdownEditor',
        viewMode: 'extended',
        editorOptions: {
            source: new Memory({
                data: [
                    { id: '1', title: 'Мужской' },
                    { id: '2', title: 'Женский' },
                ],
                keyProperty: 'id',
            }),
            extendedCaption: 'Меню пол',
            displayProperty: 'title',
            keyProperty: 'id',
        },
    },
    {
        name: 'departmentLookup',
        editorTemplateName: 'Controls/filterPanel:LookupEditor',
        resetValue: null,
        value: null,
        textValue: '',
        viewMode: 'extended',
        editorOptions: {
            source: new Memory({
                keyProperty: 'id',
                data: departments,
            }),
            displayProperty: 'title',
            keyProperty: 'id',
            extendedCaption: 'Справочник отделов',
            selectorTemplate: {
                templateName:
                    'Controls-ListEnv-demo/Filter/View/Editors/LookupEditor/resources/StackTemplate',
                templateOptions: {
                    items: departments,
                },
            },
        },
    },
];

export default class WidgetWrapper extends Control<IControlOptions, void> {
    protected _template: TemplateFunction = template;
    protected _buttonCaption: string = VERTICAL_BUTTON_CAPTION;
    protected _orientation: string = 'vertical';
    protected _columns: IColumn[] = [
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
    protected _header: IHeaderCell[] = [
        { caption: 'Отдел' },
        { caption: 'Руководитель' },
        { caption: 'Зарплата' },
        { caption: 'Город' },
        { caption: 'Дата' },
    ];

    protected _handleButtonClick(): void {
        this._orientation =
            this._orientation === 'horizontal' ? 'vertical' : 'horizontal';
        this._buttonCaption =
            this._buttonCaption === VERTICAL_BUTTON_CAPTION
                ? HORIZONTAL_BUTTON_CAPTION
                : VERTICAL_BUTTON_CAPTION;
    }

    // Т.к. механизм построения демо примеров отличается от механизма построения страницы, то данный способ предзагрузки
    // используется только для демо примеров. Посмотреть как настраивать предзагрузку на странице можно по ссылке
    // https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/
    static getLoadConfig(): unknown {
        return {
            department: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    keyProperty: 'department',
                    displayProperty: 'title',
                    source: new Memory({
                        data: sourceData,
                        keyProperty: 'department',
                        filter: dataFilter,
                    }),
                    historyItems: [
                        {
                            name: 'radioGender',
                            value: '2',
                            textValue: 'Женский',
                            viewMode: 'basic',
                        },
                    ],
                    historyId: 'FILTER_HISTORY_WITH_ITEM',
                    filterButtonSource: [
                        ...commonFilters,
                        ...[
                            lookupInputConfig,
                            dateRangeConfig,
                            dropdownConfig,
                            dateConfig,
                            textConfig,
                            tumblerConfig,
                            lookupConfig,
                            radioGroupConfig,
                            numberRangeConfig,
                            dateMenuConfig,
                            inputConfig,
                        ],
                    ],
                },
            },
            scrollDepartment: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    keyProperty: 'department',
                    displayProperty: 'title',
                    source: new Memory({
                        data: sourceData,
                        keyProperty: 'department',
                        filter: dataFilter,
                    }),
                    historyId: 'FILTER_HISTORY_WITH_ITEM',
                    historyItems: [
                        {
                            name: 'radioGender',
                            value: '2',
                            textValue: 'Женский',
                            viewMode: 'basic',
                        },
                    ],
                    filterButtonSource: [
                        ...commonFilters,
                        ...[
                            lookupInputConfig,
                            tumblerConfig,
                            numberRangeConfig,
                            dateMenuConfig,
                            inputConfig,
                            dateBasicConfig,
                            dateRangeBasicConfig,
                            dropdownBasicConfig,
                            textBasicConfig,
                            lookupBasicConfig,
                            radioGroupConfig,
                            inputBasicConfig,
                            numberRangeBasicConfig,
                            dateMenuBasicConfig,
                            simpleDateMenuBasicConfig,
                            lookupInputBasicConfig,
                            {
                                caption: 'Разработка',
                                name: 'isDevelopmentBasic',
                                editorTemplateName:
                                    'Controls/filterPanel:TextEditor',
                                resetValue: false,
                                textValue: '',
                                viewMode: 'basic',
                                value: true,
                                editorOptions: {
                                    filterValue: true,
                                    extendedCaption: 'Разработка',
                                },
                            },
                        ],
                    ],
                },
            },
        };
    }
}
