import * as companyTemplate from 'wml!Controls-demo/Lookup/MultipleInputNew/companyPlaceholder';
import { Memory } from 'Types/source';

export const lookupsOptions = [
    {
        name: 'company',
        placeholder: companyTemplate,
        searchParam: 'title',
        multiSelect: false,
        fontSize: 'xl',
        fontColorStyle: 'link',
        'data-qa': 'company',
        selectorTemplate: {
            templateName: 'Controls-demo/Lookup/MultipleInputNew/CompanySelector',
        },
        suggestTemplate: {
            templateName: 'Controls/suggestPopup:SuggestTemplate',
        },
        source: new Memory({
            data: [
                {
                    id: 0,
                    title: 'Тензор',
                },
                {
                    id: 1,
                    title: 'Газпром',
                },
                {
                    id: 2,
                    title: 'Длинное название компании, ну очень длинное',
                },
            ],
            keyProperty: 'id',
        }),
        keyProperty: 'id',
    },
    {
        name: 'input',
        placeholder: 'input',
        keyProperty: 'id',
        value: 'Текстовое  примечание',
        'data-qa': 'input',
    },
];

export const lookupsOptionsMultiSelect = [
    {
        name: 'input',
        placeholder: 'input',
        value: 'Название схемы',
        fontWeight: 'bold',
        fontSize: 'xl',
    },

    {
        name: 'company',
        placeholder: companyTemplate,
        searchParam: 'title',
        multiSelect: true,
        selectorTemplate: {
            templateName: 'Controls-demo/Lookup/FlatListSelector/FlatListSelector',
        },
        suggestTemplate: {
            templateName: 'Controls/suggestPopup:SuggestTemplate',
        },
        source: new Memory({
            data: [
                {
                    id: 0,
                    title: 'Тензор',
                },
                {
                    id: 1,
                    title: 'Газпром',
                },
                {
                    id: 2,
                    title: 'Длинное название компании, ну очень длинное',
                },
            ],
            keyProperty: 'id',
        }),
        keyProperty: 'id',
    },
];
