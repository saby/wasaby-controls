import { Memory } from 'Types/source';
import * as companyTemplate from 'wml!Controls-demo/Lookup/MultipleInputNew/companyPlaceholder';
import * as contractorTemplate from 'wml!Controls-demo/Lookup/MultipleInputNew/contractorPlaceholder';
import * as employeeTemplate from 'wml!Controls-demo/Lookup/MultipleInputNew/employeePlaceholder';

export const lookupOptions = [
    {
        name: 'company',
        placeholder: companyTemplate,
        searchParam: 'title',
        selectorTemplate: {
            templateName:
                'Controls-demo/Lookup/MultipleInputNew/CompanySelector',
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
        name: 'contractor',
        placeholder: contractorTemplate,
        searchParam: 'title',
        selectorTemplate: {
            templateName:
                'Controls-demo/Lookup/MultipleInputNew/ContractorSelector',
        },
        suggestTemplate: {
            templateName: 'Controls/suggestPopup:SuggestTemplate',
        },
        source: new Memory({
            data: [
                {
                    id: 0,
                    title: 'Крайнов Дмитрий',
                },
                {
                    id: 1,
                    title: 'Авраменко Алексей',
                },
                {
                    id: 2,
                    title: 'Человек с очень сложным именем Uvuvwevwevwe Onyetenvewve Ugwenmubwem Osas',
                },
            ],
            keyProperty: 'id',
        }),
        keyProperty: 'id',
    },
    {
        name: 'employee',
        placeholder: employeeTemplate,
        searchParam: 'title',
        keyProperty: 'id',
        selectorTemplate: {
            templateName:
                'Controls-demo/Lookup/MultipleInputNew/EmployeeSelector',
        },
        suggestTemplate: {
            templateName: 'Controls/suggestPopup:SuggestTemplate',
        },
        source: new Memory({
            data: [
                {
                    id: 0,
                    title: 'Герасимов Александр',
                },
                {
                    id: 1,
                    title: 'Михайлов Сергей',
                },
                {
                    id: 2,
                    title: 'Человек с очень сложным именем Uvuvwevwevwe Onyetenvewve Ugwenmubwem Osas',
                },
            ],
            keyProperty: 'id',
        }),
    },
];
