import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/EditInPlace/AutoAddOnInit/AutoAddOnInit';
import { Memory } from 'Types/source';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function createSource(): Memory {
    const source: Memory = new Memory({
        keyProperty: 'key',
        data: [],
    });

    // Эмуляция завязки БЛ на фильтр списка.
    const originCreate = source.create.bind(source);
    source.create = (meta) => {
        return originCreate(meta).then((item) => {
            item.set('title', 'New item in ' + meta.city);
            return item;
        });
    };

    return source;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            EditInPlaceAutoAddOnInit: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: createSource(),
                    filter: { city: 'Yaroslavl' },
                },
            },
        };
    }
}
