import { forwardRef, ForwardedRef, useState, useCallback } from 'react';
import { Button } from 'Controls/buttons';
import { Text, Number, Label } from 'Controls/input';
import { Input as Search } from 'Controls/search';
import { Selector as DropdownSelector, Button as DropdownButton } from 'Controls/dropdown';
import { RecordSet } from 'Types/collection';
import { Input as Lookup } from 'Controls/lookup';
import { Memory } from 'Types/source';
import { default as Combobox } from 'Controls/ComboBox';
import { View } from 'Controls-ListEnv/filterSearchConnected';
import { BooleanEditorConfig } from 'Controls-ListEnv-demo/Filter/View/Editors/BooleanEditor/Index';
import { TSelectedKey } from 'Controls/interface';

const companyData = [
    {
        id: 8,
        title: 'Наша компания',
        currentTab: '1',
        city: null,
        description: 'Управленческая структура',
        active: true,
    },
    {
        id: 9,
        title: 'Все юридические лица',
        currentTab: '1',
        city: null,
        description: null,
        active: true,
    },
    {
        id: 10,
        title: 'Инори, ООО',
        currentTab: '1',
        city: 'г. Ярославль',
        description: null,
        active: true,
    },
    {
        id: 11,
        title: 'Тензор, ООО',
        currentTab: '1',
        city: 'г. Ярославль',
        description: null,
        active: true,
    },
];

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

const selectorItems = new RecordSet({
    keyProperty: 'key',
    rawData: [
        {
            key: '1',
            title: 'Сообщение',
        },
        {
            key: '2',
            title: 'Отчет',
        },
        {
            key: '3',
            title: 'Задача',
        },
        {
            key: '4',
            title: 'Новости',
        },
        {
            key: '5',
            title: 'Заметки',
        },
    ],
});

const dropdownButtonItems = new RecordSet({
    keyProperty: 'key',
    rawData: [
        {
            key: '1',
            icon: 'icon-EmptyMessage',
            iconStyle: 'info',
            title: 'Message',
        },
        {
            key: '2',
            title: 'Report',
        },
        {
            key: '3',
            icon: 'icon-TFTask',
            title: 'Task',
        },
        {
            key: '4',
            title: 'News',
            readOnly: true,
        },
        {
            key: null,
            title: 'Note',
        },
    ],
});

const lookupSelectedKeys = ['Тензор, ООО'];
const lookupItems = new Memory({
    keyProperty: 'id',
    data: companyData,
});

const dropdownSelectedKeys = ['1'];

const SEARCH_FILTER_NAMES = ['employee', 'company'];
const FILTER_NAMES = ['owner', 'booleanEditor', 'capital'];

const COMBOBOX_SOURCE = new Memory({
    keyProperty: 'key',
    data: [
        { key: 1, title: 'Ярославль' },
        { key: 2, title: 'Москва' },
        { key: 3, title: 'Санкт-Петербург' },
    ],
});

function Inputs(props: { className?: string }): JSX.Element {
    const [selectorSelectedKeys, setSelectorSelectedKeys] = useState(['1']);
    const [comboboxSelectedKeys, setComboboxSelectedKeys] = useState<TSelectedKey[]>(['1']);

    const comboboxSelectedKeysChanged = useCallback(
        (value: TSelectedKey) => {
            setComboboxSelectedKeys([value]);
        },
        [setComboboxSelectedKeys]
    );

    return (
        <div className={props.className}>
            <Button className="controls-margin_left-m" caption="Кнопка" />
            <Text className="controls-margin_left-m" placeholder="Однострочное поле" />
            <Number className="controls-margin_left-m" placeholder="Число" />
            <Search className="controls-margin_left-m" placeholder="Поиск" />
            <Lookup
                className="controls-margin_left-m"
                selectedKeys={lookupSelectedKeys}
                searchParam="title"
                source={lookupItems}
                keyProperty="id"
                multiSelect={false}
                readOnly={true}
                suggestTemplate={{
                    templateName: 'Controls/lookup:ItemContentTemplate',
                    templateOptions: {
                        size: 's',
                    },
                }}
            />
            <DropdownButton
                className="controls-margin_left-m"
                items={dropdownButtonItems}
                keyProperty="key"
                displayProperty="title"
                selectedKeys={dropdownSelectedKeys}
                caption="Выберите элемент"
                iconSize="s"
                iconStyle="secondary"
            />
            <DropdownSelector
                className="controls-margin_left-m"
                selectedKeys={selectorSelectedKeys}
                onSelectedKeysChanged={setSelectorSelectedKeys}
                items={selectorItems}
                keyProperty="key"
                displayProperty="title"
            />
            <Label className="controls-margin_left-m" caption="Метка" />
            <Combobox
                className="controls-margin_left-m"
                displayProperty="title"
                keyProperty="key"
                source={COMBOBOX_SOURCE}
                selectedKeys={comboboxSelectedKeys}
                onSelectedKeyChanged={comboboxSelectedKeysChanged}
            />
            <View
                className="controls-margin_left-m"
                storeId="dateMenuData"
                searchParam="title"
                searchFilterNames={SEARCH_FILTER_NAMES}
                filterNames={FILTER_NAMES}
            />
        </div>
    );
}

const AlignmentDemo = forwardRef(function AlignmentDemo(_, ref: ForwardedRef<HTMLDivElement>) {
    return (
        <div ref={ref} className="controls-margin_left-m controls-margin_top-m">
            <div className="controls-text-label">display: block</div>
            <Inputs />
            <div className="controls-text-label">display: flex, align-items: normal</div>
            <Inputs className="tw-flex" />
            <div className="controls-text-label">display: flex, align-items: baseline</div>
            <Inputs className="tw-flex tw-items-baseline" />
        </div>
    );
});

AlignmentDemo.getLoadConfig = function () {
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
                            source: new Memory({
                                keyProperty: 'id',
                                data: companyData,
                            }),
                            navigation,
                            displayProperty: 'title',
                            keyProperty: 'id',
                        },
                    },
                    BooleanEditorConfig,
                ],
            },
        },
    };
};

export default AlignmentDemo;
