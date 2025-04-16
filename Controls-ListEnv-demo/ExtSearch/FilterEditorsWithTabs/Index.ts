import { Control, TemplateFunction } from 'UI/Base';
import SearchMemory from 'Controls-ListEnv-demo/ExtSearch/resources/SearchMemory';
import { Memory } from 'Types/source';
import * as controlTemplate from 'wml!Controls-ListEnv-demo/ExtSearch/FilterEditorsWithTabs/Index';
import { IFilterItem } from 'Controls/filter';
import { companyData, contractorData } from '../resources/Source';
import { RecordSet } from 'Types/collection';
import 'Controls-ListEnv-demo/ExtSearch/FilterEditors/Editor/Editor';
import 'css!Controls-ListEnv-demo/ExtSearch/Input';

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _contractorSource: Memory = new SearchMemory({
        keyProperty: 'id',
        data: contractorData,
    });
    protected _companySource: Memory = new SearchMemory({
        keyProperty: 'id',
        data: companyData,
    });
    protected _navigation: object = {
        source: 'page',
        view: 'page',
        sourceConfig: {
            pageSize: 5,
            page: 0,
            hasMore: false,
        },
    };
    protected _filterDescription: IFilterItem[];

    protected _beforeMount(): void {
        this._filterDescription = [
            {
                category: 'tabs',
                name: 'city',
                value: [],
                resetValue: [],
                caption: 'Контрагенты',
                order: 1,
                viewMode: 'basic',
                editorTemplateName: 'Controls/filterPanel:ListEditor',
                editorOptions: {
                    source: this._contractorSource,
                    navigation: this._navigation,
                    displayProperty: 'title',
                    keyProperty: 'id',
                },
            },
            {
                name: 'company',
                category: 'tabs',
                value: null,
                resetValue: null,
                caption: 'Компании',
                order: 0,
                viewMode: 'basic',
                editorTemplateName: 'Controls/filterPanel:ListEditor',
                editorOptions: {
                    source: this._companySource,
                    navigation: this._navigation,
                    displayProperty: 'title',
                    keyProperty: 'id',
                    footerTemplate: {
                        templateName: 'wml!Controls-ListEnv-demo/ExtSearch/resources/CompanyFooter',
                    },
                },
            },
            {
                caption: 'Пол',
                category: 'suggestEditor',
                name: 'gender',
                value: [],
                resetValue: [],
                textValue: '',
                viewMode: 'basic',
                editorTemplateName: 'Controls-ListEnv-demo/ExtSearch/FilterEditors/Editor/Editor',
                editorOptions: {
                    items: new RecordSet({
                        rawData: [
                            {
                                id: 'Мужской',
                                title: 'Мужской',
                            },
                            {
                                id: 'Женский',
                                title: 'Женский',
                            },
                        ],
                        keyProperty: 'id',
                    }),
                },
            },
        ];
    }
}
