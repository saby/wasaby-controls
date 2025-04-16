import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/FilterPanelPopup/Sticky/Adaptive/Index';
import { Memory } from 'Types/source';
import * as filter from './DataFilter';
import { IDataConfig, IListDataFactoryArguments } from 'Controls-DataEnv/dataFactory';

export const dropdownConfig = {
    name: 'city',
    value: ['Yaroslavl'],
    resetValue: [],
    editorTemplateName: 'Controls/filterPanelEditors:Dropdown',
    viewMode: 'basic',
    editorOptions: {
        source: new Memory({
            data: [
                { id: 'Yaroslavl', title: 'Yaroslavl' },
                { id: 'Moscow', title: 'Moscow' },
                { id: 'Kazan', title: 'Kazan' },
            ],
            keyProperty: 'id',
        }),
        extendedCaption: 'Город',
        displayProperty: 'title',
        keyProperty: 'id',
    },
};

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            adaptiveData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: [
                            { id: 'Yaroslavl', title: 'Yaroslavl' },
                            { id: 'Moscow', title: 'Moscow' },
                            { id: 'Kazan', title: 'Kazan' },
                        ],
                        keyProperty: 'department',
                        filter,
                    }),
                    keyProperty: 'id',
                    displayProperty: 'title',
                    filterDescription: [dropdownConfig],
                },
            },
        };
    }
}
