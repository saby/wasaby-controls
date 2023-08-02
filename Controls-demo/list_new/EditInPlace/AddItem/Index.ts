import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/EditInPlace/AddItem/AddItem';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { View as List } from 'Controls/list';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { getFewCategories as getData } from '../../DemoHelpers/DataCatalog';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _children: {
        list: List;
    };
    private _fakeItemId: number = 1000;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
        };
    }

    protected _beginAddEmpty(): void {
        this._children.list.beginAdd();
    }

    protected _beginAddWithConfig(): void {
        this._children.list.beginAdd({
            meta: {
                key: ++this._fakeItemId,
                title: 'Новая запись, создана стандартными средствами...',
            },
        });
    }

    protected _beginAddTemplated(): void {
        this._children.list.beginAdd({
            item: new Model({
                keyProperty: 'key',
                rawData: { key: ++this._fakeItemId, title: 'Новая запись...' },
            }),
        });
    }
}
