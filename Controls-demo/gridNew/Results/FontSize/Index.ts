import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import { Data } from 'Controls-demo/gridNew/Results/FontSize/Data';

import * as Template from 'wml!Controls-demo/gridNew/Results/FontSize/FontSize';

const { getData } = Data;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _header: IHeaderCell[] = Data.getHeader();
    protected _columns: IColumn[] = Data.getColumns();

    constructor() {
        super({});
        this._dataLoadCallback = this._dataLoadCallback.bind(this);
    }

    private _dataLoadCallback(items: RecordSet): void {
        const results = new Model({
            // Устанавливаем адаптер для работы с данными, он будет соответствовать адаптеру RecordSet'а.
            adapter: items.getAdapter(),

            // Устанавливаем тип полей строки итогов.
            format: [
                { name: 'M', type: 'real' },
                { name: 'L', type: 'real' },
                { name: 'XL', type: 'real' },
                { name: '$2XL', type: 'real' },
                { name: '$3XL', type: 'real' },
                { name: '$4XL', type: 'real' },
                { name: '$5XL', type: 'real' },
            ],

            // Устанавливаем значения полей
            rawData: {
                M: '30.6',
                L: '30.1',
                XL: '30.6',
                $2XL: '30.5',
                $3XL: '30',
                $4XL: '30.1',
                $5XL: '300000',
            },
        });

        items.setMetaData({
            ...items.getMetaData(),
            results,
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
