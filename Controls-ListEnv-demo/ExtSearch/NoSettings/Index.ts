import { Control, TemplateFunction } from 'UI/Base';
import SearchMemory from 'Controls-ListEnv-demo/ExtSearch/resources/SearchMemory';
import { Memory } from 'Types/source';
import * as controlTemplate from 'wml!Controls-ListEnv-demo/ExtSearch/RadioButtons/Index';
import { IFilterItem } from 'Controls/filter';
import { companyData, contractorData } from '../resources/Source';
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
                type: 'list',
                name: 'city',
                value: [],
                resetValue: [],
                caption: 'Контрагенты',
                order: 1,
                editorTemplateName: 'Controls/filterPanelEditors:Lookup',
                editorOptions: {
                    source: this._contractorSource,
                    navigation: this._navigation,
                    displayProperty: 'title',
                    keyProperty: 'id',
                },
            },
            {
                name: 'company',
                type: 'list',
                value: null,
                resetValue: null,
                caption: 'Компании',
                order: 0,
                editorTemplateName: 'Controls/filterPanelEditors:Lookup',
                editorOptions: {
                    source: this._companySource,
                    navigation: this._navigation,
                    displayProperty: 'title',
                    keyProperty: 'id',
                },
            },
            // {
            //     name: 'owner',
            //     resetValue: [],
            //     value: [],
            //     textValue: '',
            //     editorTemplateName: 'Controls-ListEnv/filterPanelExtEditors:RadioGroupEditor',
            //     // editorOptions: {
            //     //     multiSelect: true,
            //     //     direction: 'horizontal',
            //     //     keyProperty: 'id',
            //     //     displayProperty: 'title',
            //     //     items: new RecordSet({
            //     //         rawData: filterItems,
            //     //         keyProperty: 'id',
            //     //     }),
            //     // },
            // },
        ];
    }

    protected _filterDescriptionChanged(event: Event, filterDescription: IFilterItem[]): void {
        this._filterDescription = filterDescription;
    }
}
