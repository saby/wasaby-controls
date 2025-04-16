import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/Marker/RemoveItem/RemoveItem';
import { Memory } from 'Types/source';
import { generateData } from '../../DemoHelpers/DataCatalog';
import { RecordSet } from 'Types/collection';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

interface IItem {
    key: number;
    title: string;
}

function getData(): IItem[] {
    return generateData<IItem>({
        count: 20,
        entityTemplate: { title: 'number' },
        beforeCreateItemCallback: (item) => {
            item.title = `Запись #${item.key}`;
        },
    });
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _items: RecordSet;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            MarkerRemoveItem: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    markedKey: 0,
                },
            },
        };
    }

    protected _removeItem(): void {
        this._items.removeAt(this._items.getCount() - 1);
    }

    private _itemsReadyCallback = (items: RecordSet): void => {
        this._items = items;
    };
}
