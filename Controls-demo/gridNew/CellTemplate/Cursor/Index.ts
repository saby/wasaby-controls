import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/CellTemplate/Cursor/Cursor';
import * as NumberCellTemplate from 'wml!Controls-demo/gridNew/CellTemplate/Cursor/NumberCell';
import * as CountryCellTemplate from 'wml!Controls-demo/gridNew/CellTemplate/Cursor/CountryCell';
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
            template: NumberCellTemplate,
        },
        {
            displayProperty: 'country',
            width: '300px',
            template: CountryCellTemplate,
        },
        {
            displayProperty: 'population',
            width: 'max-content',
            compatibleWidth: '118px',
        },
        {
            displayProperty: 'square',
            width: 'max-content',
            compatibleWidth: '156px',
        },
    ];

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            CellTemplateCursor: {
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
