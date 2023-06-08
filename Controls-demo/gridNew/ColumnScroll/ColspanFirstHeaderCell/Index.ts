import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/ColumnScroll/Base/Base';
import { Memory } from 'Types/source';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Countries;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = Countries.getColumnsWithWidths();
    protected _header: IHeaderCell[] = [
        {
            caption: 'Страна',
            startRow: 1,
            endRow: 2,
            startColumn: 1,
            endColumn: 3,
        },
        {
            caption: 'Столица',
            startRow: 1,
            endRow: 2,
            startColumn: 3,
            endColumn: 4,
        },
        {
            caption: 'Население',
            startRow: 1,
            endRow: 2,
            startColumn: 4,
            endColumn: 5,
        },
        {
            caption: 'Площадь км2',
            startRow: 1,
            endRow: 2,
            startColumn: 5,
            endColumn: 6,
        },
        {
            caption: 'Плотность населения чел/км2',
            startRow: 1,
            endRow: 2,
            startColumn: 6,
            endColumn: 7,
        },
    ];
    private _selectedKeys: number[] = [];

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
