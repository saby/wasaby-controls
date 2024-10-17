import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Sorting/SortingIcon/SortingIcon';
import { Memory } from 'Types/source';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { Sorting } from 'Controls-demo/gridNew/DemoHelpers/Data/Sorting';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Countries;

const getHeader: IHeaderCell[] = [
    {
        caption: '#',
    },
    {
        caption: 'Страна',
    },
    {
        caption: 'Город',
        sortingProperty: 'capital',
        align: 'left',
    },
    {
        sortingProperty: 'population',
        align: 'left',
        sortingIcon: 'icon-Client2',
    },
    {
        sortingProperty: 'square',
        align: 'right',
        sortingIcon: 'icon-Map',
    },
    {
        caption: 'Плотность населения чел/км2',
        sortingProperty: 'populationDensity',
        align: 'right',
    },
];

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _header: IHeaderCell[] = getHeader;
    protected _columns: IColumn[] = Sorting.getColumns();

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
                    sorting: [],
                },
            },
        };
    }
}
