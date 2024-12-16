import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/Filter/Adaptive/Index';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { IFilterItem } from 'Controls/filter';
import * as dataFilter from './DataFilter';

const data = [
    { id: 1, title: 'Ярославль', country: 'Russia' },
    { id: 2, title: 'Москва', country: 'Russia' },
    { id: 3, title: 'Вашингтон', country: 'USA' },
    { id: 4, title: 'Ростов', country: 'Russia' },
    { id: 5, title: 'Рим', country: 'Italy' },
];

export const dropdownConfig = {
    name: 'capital',
    value: null,
    resetValue: null,
    editorOptions: {
        items: new RecordSet({
            rawData: data,
            keyProperty: 'id',
        }),
        displayProperty: 'title',
        keyProperty: 'id',
    },
} as IFilterItem;

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): unknown {
        return {
            city: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    filterDescription: [dropdownConfig],
                    keyProperty: 'id',
                    displayProperty: 'title',
                    source: new Memory({
                        data,
                        keyProperty: 'id',
                        filter: dataFilter,
                    }),
                },
            },
        };
    }
}
