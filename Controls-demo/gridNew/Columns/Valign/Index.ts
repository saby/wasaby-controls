import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Columns/Valign/Valign';
import * as CellTemplate from 'wml!Controls-demo/gridNew/Columns/Valign/CellTemplate';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
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
            width: '40px',
            valign: 'center',
            template: CellTemplate,
        },
        {
            displayProperty: 'country',
            width: '300px',
            valign: 'top',
            template: CellTemplate,
        },
        {
            displayProperty: 'capital',
            width: '1fr',
            valign: 'bottom',
            template: CellTemplate,
        },
        {
            displayProperty: 'population',
            width: '150px',
            template: CellTemplate,
        },
    ];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ColumnsValign: {
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
