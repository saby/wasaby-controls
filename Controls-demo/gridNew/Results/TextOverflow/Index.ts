import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';

import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

import * as Template from 'wml!Controls-demo/gridNew/Results/TextOverflow/TextOverflow';
import * as sqResTpl from 'wml!Controls-demo/gridNew/Results/TextOverflow/resultCell';
import * as defResTpl from 'wml!Controls-demo/gridNew/Results/TextOverflow/resultCellDefault';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const MAXITEM = 10;

function getData() {
    return Countries.getData().slice(0, MAXITEM);
}

interface IColumnWithResult extends IColumn {
    result: string | number;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumnWithResult[] = [
        {
            displayProperty: 'country',
            width: 'auto',
            textOverflow: 'ellipsis',
            align: 'right',
            result: undefined,
        },
        {
            displayProperty: 'square',
            width: 'auto',
            textOverflow: 'ellipsis',
            result: undefined,
            align: 'right',
            resultTemplate: sqResTpl,
        },
        {
            displayProperty: 'population',
            width: 'auto',
            textOverflow: 'ellipsis',
            result: undefined,
            align: 'right',
            resultTemplate: defResTpl,
        },
        {
            displayProperty: 'populationDensity',
            width: 'min-content',
            textOverflow: 'ellipsis',
            align: 'right',
            result: undefined,
        },
    ];
    private _fullResultsIndex: number = 0;

    constructor() {
        super({});
        this._dataLoadCallback = this._dataLoadCallback.bind(this);
    }

    private _dataLoadCallback(items: RecordSet): void {
        items.setMetaData({
            ...items.getMetaData(),
            results: this._generateResults(items),
        });
    }

    private _generateResults(items: RecordSet): Model {
        const results = new Model({
            // Устанавливаем адаптер для работы с данными, он будет соответствовать адаптеру RecordSet'а.
            adapter: items.getAdapter(),

            // Устанавливаем тип полей строки итогов.
            format: [
                { name: 'square', type: 'real' },
                { name: 'population', type: 'real' },
                { name: 'populationDensity', type: 'real' },
            ],
        });

        results.set('population', 8996143455623660205559.49);
        results.set('square', 19358447234235616.8749);
        results.set('populationDensity', 5654645645645645645.8749);

        this._fullResultsIndex = ++this._fullResultsIndex % Countries.getResults().full.length;
        return results;
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
