import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Header/Valign/Valign';
import * as HeaderCellTemplate from 'wml!Controls-demo/gridNew/Header/Valign/HeaderCell';
import { Memory } from 'Types/source';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Countries.getData().slice(0, 5);
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _header: IHeaderCell[] = [
        {
            title: '# (default)',
            template: HeaderCellTemplate,
        },
        {
            title: 'Страна (top)',
            valign: 'top',
        },
        {
            title: 'Столица (center)',
            valign: 'center',
        },
        {
            title: 'Население (bottom)',
            valign: 'bottom',
        },
        {
            title: 'Население (baseline)',
            valign: 'baseline',
        },
    ];
    protected _columns: IColumn[] = [
        {
            displayProperty: 'number',
            width: '80px',
        },
        {
            displayProperty: 'country',
            width: '200px',
        },
        {
            displayProperty: 'capital',
            width: 'max-content',
            compatibleWidth: '98px',
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
