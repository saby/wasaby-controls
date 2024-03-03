import { Control, TemplateFunction } from 'UI/Base';
import { RecordSet } from 'Types/collection';
import * as Template from 'wml!Controls-demo/gridNew/ColumnScroll/ScrollStartPositionEnd/ScrollStartPositionEnd';
import { Memory } from 'Types/source';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Countries;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _items: RecordSet;
    protected _columns: IColumn[] = Countries.getColumnsWithWidths();
    protected _header: IHeaderCell[] = Countries.getHeader();

    protected _beforeMount(): void {
        this._itemsReadyCallback = this._itemsReadyCallback.bind(this);
    }

    protected _itemsReadyCallback(items: RecordSet): void {
        this._items = items;
    }

    protected _onClickAdd(): void {
        const newItem = this._items.at(0).clone();
        newItem.set({
            key: 999,
            number: 999,
            country: 'Южная Африканская Республика',
            capital: 'Претория, Кейптаун, Блумфонтейн',
            population: 54956900,
            square: 1219912,
            populationDensity: 41,
        });
        this._items.add(newItem);
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ColumnScrollScrollStartPositionEnd: {
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
}
