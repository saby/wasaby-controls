import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Columns/Valign/Valign';
import * as CellTemplate from 'wml!Controls-demo/gridNew/Columns/Valign/CellTemplate';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;

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

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            // eslint-disable-next-line
            data: Countries.getData().slice(0, 5),
        });
    }
}
