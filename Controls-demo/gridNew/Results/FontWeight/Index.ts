import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Results/FontWeight/FontWeight';
import * as DefaultFontWeightCellTemplate from 'wml!Controls-demo/gridNew/Results/FontWeight/DefaultFontWeightCell';
import { Memory } from 'Types/source';
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

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ResultsFontWeight: {
                dataFactoryName: 'Controls-demo/gridNew/Results/FontWeight/CustomFactory',
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
