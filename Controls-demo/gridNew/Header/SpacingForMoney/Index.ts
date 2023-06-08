import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { Data } from 'Controls-demo/gridNew/Header/SpacingForMoney/Data';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/gridNew/Header/SpacingForMoney/SpacingForMoney';

const { getData } = Data;

/**
 * Демка для https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/header/visual/#paddings
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _header: IHeaderCell[] = Data.getHeader();
    protected _columns: IColumn[] = Data.getColumns();

    protected _beforeMount(): void {
        this._itemsReadyCallback = this._itemsReadyCallback.bind(this);
    }

    protected _itemsReadyCallback(items: RecordSet): void {
        items.setMetaData({
            ...items.getMetaData(),
            results: Data.getMeta(items.getAdapter()),
        });
    }

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
}
