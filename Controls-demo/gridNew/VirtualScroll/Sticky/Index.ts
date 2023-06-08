import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/VirtualScroll/Sticky/Sticky';
import { Memory } from 'Types/source';
import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';
import { IColumn, THeader } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

interface IItem {
    capital: string;
    number: number;
    country: string;
    group: string;
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: IColumn[] = [
        {
            displayProperty: 'number',
            width: '40px',
        },
        {
            displayProperty: 'country',
            width: '200px',
        },
        {
            displayProperty: 'capital',
            width: '200px',
        },
    ];
    protected _header: THeader = [
        {
            caption: 'number',
        },
        {
            caption: 'country',
        },
        {
            caption: 'capital',
        },
    ];
    private count: number = 0;

    private dataArray: IItem[] = generateData({
        keyProperty: 'key',
        count: 500,
        beforeCreateItemCallback: (item: IItem) => {
            item.capital = 'South';
            item.number = this.count + 1;
            item.group = 'groupName';
            item.country = Countries.COUNTRIES[this.count];
            this.count++;
        },
    });

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: this.dataArray,
        });
    }
}
