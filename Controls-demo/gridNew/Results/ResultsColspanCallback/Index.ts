import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { IColumn, TColspanCallbackResult } from 'Controls/grid';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import { Data } from 'Controls-demo/gridNew/Results/ResultsColspanCallback/Data';

import * as Template from 'wml!Controls-demo/gridNew/Results/ResultsColspanCallback/ResultsColspanCallback';

const { getData } = Data;

/**
 * Демка для https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/results/colspan/
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = Data.getColumns();

    protected _beforeMount(): void {
        this._itemsReadyCallback = this._itemsReadyCallback.bind(this);
        this._resultsColspanCallback = this._resultsColspanCallback.bind(this);
    }

    protected _resultsColspanCallback(
        column: IColumn,
        columnIndex: number
    ): TColspanCallbackResult {
        if (columnIndex === 2) {
            return 'end';
        }
    }

    protected _itemsReadyCallback(items: RecordSet): void {
        items.setMetaData({
            ...items.getMetaData(),
            results: Data.getMeta(items.getAdapter()),
        });
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ResultsColspanCallback: {
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
