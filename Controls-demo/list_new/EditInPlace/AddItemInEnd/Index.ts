import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/list_new/EditInPlace/AddItemInEnd/AddItemInEnd';
import { Memory } from 'Types/source';
import { generateData } from '../../DemoHelpers/DataCatalog';

interface IItem {
    title: string;
    key: number;
    keyProperty: string;
    count: number;
}

function getData(): IItem[] {
    return generateData({
        keyProperty: 'key',
        count: 50,
        beforeCreateItemCallback: (item: IItem) => {
            item.title = `Запись с ключом ${item.key}.`;
        },
    });
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    private _itemsCount: number = 50;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            EditInPlaceAddItemInEnd: {
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

    protected _addItem(): void {
        const item = {
            key: ++this._itemsCount,
            title: `Запись с ключом ${this._itemsCount}.`,
        };
        this._children.list.beginAdd({ item });
    }
}
