import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { TOffsetSize } from 'Controls/interface';
import { Control, TemplateFunction } from 'UI/Base';
import { IColumn } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import * as template from 'wml!Controls-demo/gridNew/ItemsSpacing/Index';
import 'css!DemoStand/Controls-demo';
import * as countryRatingNumber from 'wml!Controls-demo/gridNew/resources/CellTemplates/CountryRatingNumber';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Countries;

export default class Index extends Control {
    protected _template: TemplateFunction = template;

    protected _viewSource: Memory;
    protected _columns: IColumn[] = Countries.getColumns();

    protected _itemsSpacingSource: RecordSet = new RecordSet({
        rawData: [
            { id: '3xs' },
            { id: '2xs' },
            { id: 'xs' },
            { id: 's' },
            { id: 'st' },
            { id: 'm' },
            { id: 'l' },
            { id: 'xl' },
            { id: '2xl' },
            { id: '3xl' },
        ],
        keyProperty: 'id',
    });

    protected _itemsSpacing: TOffsetSize = 'm';

    protected _beforeMount(): void {
        this._columns[0].template = countryRatingNumber;
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
