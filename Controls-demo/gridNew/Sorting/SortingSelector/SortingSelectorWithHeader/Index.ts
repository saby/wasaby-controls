import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Sorting/SortingSelector/SortingSelectorWithHeader/SortingSelectorWithHeader';
import { Memory } from 'Types/source';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';
import { SyntheticEvent } from 'Vdom/Vdom';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

const { getData } = Countries;

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
    protected _sortingParams: object[] = [
        {
            title: 'По порядку',
            paramName: null,
            icon: 'Controls/sortIcons:non_sort',
        },
        {
            title: 'По населению',
            paramName: 'population',
            icon: 'Controls/sortIcons:number',
        },
        {
            title: 'По площади',
            paramName: 'square',
            icon: 'Controls/sortIcons:number',
        },
        {
            title: 'По плотности населения',
            paramName: 'populationDensity',
            icon: 'Controls/sortIcons:rating',
        },
    ];
    protected _sorting: object[] = [{ population: 'ASC' }];
    protected _menuHeader: string = 'Сортировать';
    protected _columns: object[] = Countries.getColumnsWithWidths();

    protected _onSortingChanged(e: SyntheticEvent, sorting: object[]): void {
        this._sorting = sorting;
        this._options._dataOptionsValue.SortingSelectorSortingSelectorWithHeader.setState({
            sorting,
        });
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            SortingSelectorSortingSelectorWithHeader: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    sorting: [{ population: 'ASC' }],
                },
            },
        };
    },
});
