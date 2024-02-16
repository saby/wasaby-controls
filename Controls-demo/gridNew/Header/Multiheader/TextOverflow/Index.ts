import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Header/Multiheader/TextOverflow/TextOverflow';
import { Memory } from 'Types/source';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { Sorting } from 'Controls-demo/gridNew/DemoHelpers/Data/Sorting';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Countries;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _header: IHeaderCell[] = [
        {
            title: '#',
            startRow: 1,
            endRow: 3,
            startColumn: 1,
            endColumn: 2,
        },
        {
            title: 'Географические данные и какой-то очень длинный текст с описанием и примерами',
            startRow: 1,
            endRow: 2,
            startColumn: 2,
            endColumn: 4,
            textOverflow: 'ellipsis',
            align: 'center',
        },
        {
            title: 'Страна',
            startRow: 2,
            endRow: 3,
            startColumn: 2,
            endColumn: 3,
        },
        {
            title: 'Столица',
            startRow: 2,
            endRow: 3,
            startColumn: 3,
            endColumn: 4,
        },
        {
            title: 'Цифры и какой-то очень длинный текст с описанием и примерами',
            startRow: 1,
            endRow: 2,
            startColumn: 4,
            endColumn: 7,
            textOverflow: 'none',
            align: 'center',
        },
        {
            title: 'Население',
            startRow: 2,
            endRow: 3,
            startColumn: 4,
            endColumn: 5,
        },
        {
            title: 'Площадь км2',
            startRow: 2,
            endRow: 3,
            startColumn: 5,
            endColumn: 6,
        },
        {
            title: 'Плотность населения чел/км2',
            startRow: 2,
            endRow: 3,
            startColumn: 6,
            endColumn: 7,
        },
    ];
    protected _columns: IColumn[] = Sorting.getColumns();

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            MultiheaderTextOverflow: {
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
