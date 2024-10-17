import { RecordSet } from 'Types/collection';
import { Memory } from 'Types/source';
import { IFilterItem } from 'Controls/filter';
import SearchMemory from 'Controls-ListEnv-demo/SuggestSearchInput/Base/resources/SearchMemory';
import { object } from 'Types/util';
import { TEditorsViewMode } from 'Controls/filterPanel';
import { SessionStorage } from 'BrowserAPI/Storage';
import { query } from 'Application/Env';

interface IListItem {
    country: string;
    title: string;
    available: string;
    type?: string;
    company?: string;
    primaryCompany?: string;
    screenType?: string;
    id: number | string;
    inStock?: boolean;
    parent?: any;
    node?: boolean;
}

export function getFlatList(country: string[], countInStock: number): IListItem[] {
    const items = [
        {
            country: 'США',
            title: 'США',
            available: 'Есть в наличии',
            id: '1',
            inStock: true,
            parent: null,
            node: true,
        },
        {
            country: 'Южная Корея',
            title: 'Южная Корея',
            available: 'Есть в наличии',
            id: '2',
            inStock: true,
            parent: null,
            node: true,
        },
        {
            country: 'Тайвань',
            title: 'Тайвань',
            available: 'Есть в наличии',
            id: '3',
            inStock: true,
            parent: null,
            node: true,
        },
    ] as IListItem[];
    country.forEach((countryName) => {
        const parent = new Map([
            ['США', 1],
            ['Южная Корея', 2],
            ['Тайвань', 3],
            ['Калифорния', 4],
        ]);
        for (let i = 0; i < countInStock; i++) {
            items.push({
                country: countryName,
                title: `Товар из страны ${countryName} номер ${items.length}`,
                available: 'Есть в наличии',
                type: 'Ноутбуки',
                company: 'Samsung',
                primaryCompany: 'Samsung',
                screenType: 'IPS',
                id: `${parent.get(countryName)}_laptop_${i}`,
                inStock: true,
                parent: String(parent.get(countryName)),
                node: null,
            });
            items.push({
                country: countryName,
                title: `Товар из страны ${countryName} номер ${items.length}`,
                available: 'Нет в наличии',
                type: 'ПК',
                company: 'Apple',
                primaryCompany: 'Apple',
                screenType: 'OLED',
                id: `${parent.get(countryName)}_pc_${i}`,
                inStock: false,
                parent: null,
                node: null,
            });
            items.push({
                country: countryName,
                title: `Товар из страны ${countryName} номер ${items.length}`,
                available: 'Есть в наличии',
                type: 'Телевизоры',
                company: 'Xiaomi',
                primaryCompany: 'Xiaomi',
                screenType: 'SVA',
                id: `${parent.get(countryName)}_tv_${i}`,
                inStock: true,
                parent: null,
                node: null,
            });
        }
    });

    return [items[0], ...getCaliforniaFolder(), ...items.slice(1)];
}

function getCaliforniaFolder(): IListItem[] {
    const items: IListItem[] = [];
    items.push({
        country: 'США',
        title: 'Калифорния',
        available: 'Есть в наличии',
        id: '4',
        inStock: true,
        parent: null,
        node: true,
    });
    [...Array(3)].forEach((item) => {
        items.push({
            country: 'США',
            title: `Товар из Калифорни номер ${items.length}`,
            available: 'Есть в наличии',
            type: 'Ноутбуки',
            company: 'Samsung',
            primaryCompany: 'Samsung',
            screenType: 'IPS',
            id: `4_laptop_${items.length}`,
            inStock: true,
            parent: '4',
            node: null,
        });
    });
    return items;
}

export function getEditorsViewMode(): string {
    const savedValue = SessionStorage.get('editorsViewMode');
    if (!savedValue) {
        return query.get.editorsViewMode ? query.get.editorsViewMode : 'cloud|default';
    } else if (savedValue === 'notSelected') {
        return undefined;
    }
    return savedValue;
}

export function getFilterDescription(editorsViewMode?: TEditorsViewMode): IFilterItem[] {
    const typeEditorData = [
        { id: 'Ноутбуки', title: 'Ноутбуки' },
        { id: 'ПК', title: 'ПК' },
        { id: 'Телевизоры', title: 'Телевизоры' },
        { id: 'Смартфоны', title: 'Смартфоны' },
    ];

    const screenTypeEditorData = [
        { id: 'IPS', title: 'IPS' },
        { id: 'OLED', title: 'OLED' },
        { id: 'SVA', title: 'SVA' },
        { id: 'mini-LED', title: 'mini-LED' },
    ];
    const companyEditorData = [
        { id: 'Samsung', title: 'Samsung' },
        { id: 'Apple', title: 'Apple' },
        { id: 'Xiaomi', title: 'Xiaomi' },
        { id: 'Huawei', title: 'Huawei' },
    ];

    const countryEditorData = [
        { id: 'США', caption: 'США' },
        { id: 'Тайвань', caption: 'Тайвань' },
        { id: 'Южная Корея', caption: 'Южная Корея' },
    ];

    const companyEditor = {
        name: 'company',
        caption: 'Компания',
        value: null,
        resetValue: null,
        editorTemplateName: 'Controls/filterPanel:ListEditor',
        textValue: '',
        viewMode: editorsViewMode === 'popupCloudPanelDefault' ? 'basic' : 'extended',
        extendedCaption: 'Компания',
        expanderVisible: true,
        editorOptions: {
            source: new Memory({
                data: companyEditorData,
                keyProperty: 'id',
            }),
            displayProperty: 'title',
            keyProperty: 'id',
            selectorTemplate: {
                templateName: 'Controls-ListEnv-demo/StoreIdConnected/SelectorStack',
                templateOptions: {
                    items: companyEditorData,
                },
            },
        },
    } as IFilterItem;
    const primaryCompanyEditor = object.clone(companyEditor);
    primaryCompanyEditor.name = 'primaryCompany';
    primaryCompanyEditor.editorOptions.markerStyle = 'primary';
    return [
        {
            name: 'inStock',
            value: null,
            resetValue: null,
            textValue: '',
            viewMode: 'extended',
            extendedCaption: 'В наличии',
            editorTemplateName: 'Controls/filterPanelEditors:Boolean',
            editorOptions: {
                filterValue: true,
            },
        } as IFilterItem,
        {
            name: 'country',
            value: 'США',
            resetValue: 'США',
            viewMode: 'basic',
            textValue: 'США',
            editorOptions: {
                items: new RecordSet({
                    rawData: countryEditorData,
                    keyProperty: 'id',
                }),
            },
        } as IFilterItem,
        {
            name: 'type',
            caption: 'Тип',
            value: null,
            resetValue: null,
            editorTemplateName: 'Controls/filterPanel:ListEditor',
            textValue: '',
            viewMode: 'extended',
            extendedCaption: 'Тип',
            expanderVisible: true,
            type: 'list',
            editorOptions: {
                source: new SearchMemory({
                    data: typeEditorData,
                    keyProperty: 'id',
                }),
                displayProperty: 'title',
                keyProperty: 'id',
                markerStyle: 'primary',
                selectorTemplate: {
                    templateName: 'Controls-ListEnv-demo/StoreIdConnected/SelectorStack',
                    templateOptions: {
                        items: typeEditorData,
                    },
                },
            },
        } as IFilterItem,
        {
            name: 'screenType',
            caption: 'Тип экрана',
            value: [],
            resetValue: [],
            editorTemplateName: 'Controls/filterPanel:ListEditor',
            textValue: '',
            viewMode: 'extended',
            extendedCaption: 'Тип экрана',
            expanderVisible: true,
            editorOptions: {
                multiSelect: true,
                source: new Memory({
                    data: screenTypeEditorData,
                    keyProperty: 'id',
                }),
                selectorTemplate: {
                    templateName: 'Controls-ListEnv-demo/StoreIdConnected/SelectorStack',
                    templateOptions: {
                        items: screenTypeEditorData,
                    },
                },
                displayProperty: 'title',
                keyProperty: 'id',
            },
        } as IFilterItem,
        companyEditor,
        primaryCompanyEditor,
    ];
}
