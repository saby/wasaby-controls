import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/EditInPlace/TextArea/TextArea';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { View as List } from 'Controls/list';
import { getFewCategories } from '../../DemoHelpers/DataCatalog';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    const data = getFewCategories();
    data[0] = {
        ...data[0],
        useTextArea: true,
        title: 'Here is textarea. Can save only by CTRL + ENTER.',
    };
    return data;
}

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

    protected _beginAdd(): void {
        this._children.list.beginAdd({
            item: new Model({
                keyProperty: 'key',
                rawData: { key: ++this._fakeItemId, title: '' },
            }),
        });
    }
}
