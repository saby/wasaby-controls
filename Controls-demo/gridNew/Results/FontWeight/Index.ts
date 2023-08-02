import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Results/FontWeight/FontWeight';
import * as DefaultFontWeightCellTemplate from 'wml!Controls-demo/gridNew/Results/FontWeight/DefaultFontWeightCell';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Countries.getData().splice(0, 5);
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _header: IHeaderCell[] = Countries.getHeader();
    protected _columns: IColumn[] = [
        {
            displayProperty: 'number',
            width: '40px',
        },
        {
            displayProperty: 'country',
            width: '300px',
        },
        {
            displayProperty: 'population',
            width: 'max-content',
            compatibleWidth: '118px',
        },
        {
            displayProperty: 'square',
            width: 'max-content',
            resultTemplate: DefaultFontWeightCellTemplate,
            compatibleWidth: '156px',
        },
    ];

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
                { name: 'population', type: 'real' },
                { name: 'square', type: 'real' },
            ],

            // Устанавливаем значения полей
            rawData: {
                population: 3660205559.49,
                square: 19358447.87,
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
