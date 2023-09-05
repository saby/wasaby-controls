import { adapter as EntityAdapter, Model } from 'Types/entity';
import { IColumn } from 'Controls/grid';

import * as CountResult from 'wml!Controls-demo/gridNew/Results/ResultsColspanCallback/CountResult';
import * as TotalResult from 'wml!Controls-demo/gridNew/Results/ResultsColspanCallback/TotalResult';

export const Data = {
    getColumns(): IColumn[] {
        return [
            { displayProperty: 'name', width: '250px' },
            {
                displayProperty: 'count',
                width: '50px',
                resultTemplate: CountResult,
            },
            {
                displayProperty: 'price',
                width: '75px',
                align: 'right',
                resultTemplate: TotalResult,
            },
            { displayProperty: 'total', width: '75px', align: 'right' },
        ];
    },
    getData(): any {
        return [
            {
                key: 0,
                name: 'Умная колонка Алиса',
                count: '12',
                price: '10.6',
                total: '127.199',
            },
            {
                key: 1,
                name: 'Умная колонка Alexa',
                count: '23',
                price: '15.1',
                total: '347.3',
            },
        ];
    },
    getMeta(adapter: EntityAdapter.IAdapter): Model {
        return new Model({
            // Устанавливаем адаптер для работы с данными, он будет соответствовать адаптеру RecordSet'а.
            adapter,

            // Устанавливаем тип полей строки итогов.
            format: [
                { name: 'count', type: 'real' },
                { name: 'price', type: 'real' },
                { name: 'total', type: 'real' },
            ],

            // Устанавливаем значения полей
            rawData: {
                count: '35',
                price: '25.7',
                total: '474.499',
            },
        });
    },
};
