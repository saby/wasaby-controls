import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/Search/List/EditInPlace/EditInPlace';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { getFewCategories as getData } from 'Controls-ListEnv-demo/Search/DataHelpers/DataCatalog';
import { View as List } from 'Controls/list';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _children: {
        list: List;
    };
    private _fakeItemId: number = 1000;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            SearchingEditInPlace: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    filter: {},
                    searchParam: 'title',
                    minSearchLength: 3,
                },
            },
        };
    }

    protected _beginAdd(): void {
        this._children.list.beginAdd({
            item: new Model({
                keyProperty: 'key',
                rawData: { key: ++this._fakeItemId, title: '' },
            }),
        });
    }
}
