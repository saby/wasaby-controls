import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Columns/Template/Template';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import * as countryRatingNumber from 'wml!Controls-demo/gridNew/resources/CellTemplates/CountryRatingNumber';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Countries.getData().splice(0, 5);
}

export default class extends Control {
    protected _template: TemplateFunction = Template;

    protected _columns: IColumn[] = [
        {
            displayProperty: 'number',
            width: 'max-content',
            compatibleWidth: '44px',
            template: countryRatingNumber,
        },
        {
            displayProperty: 'country',
            width: '300px',
        },
        {
            displayProperty: 'capital',
            width: '100px',
        },
        {
            displayProperty: 'population',
            width: '150px',
        },
        {
            displayProperty: 'square',
            width: '150px',
        },
        {
            displayProperty: 'populationDensity',
            width: 'max-content',
            compatibleWidth: '60px',
        },
    ];

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
