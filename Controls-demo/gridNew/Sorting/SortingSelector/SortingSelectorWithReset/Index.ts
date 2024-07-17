import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Sorting/SortingSelector/SortingSelectorWithReset/SortingSelectorWithReset';
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
            title: 'Без сортировки',
            paramName: null,
        },
        {
            title: 'По населению',
            paramName: 'population',
        },
        {
            title: 'По площади',
            paramName: 'square',
        },
        {
            title: 'По плотности населения',
            paramName: 'populationDensity',
        },
    ];
    protected _sorting: object[] = [];
    protected _columns: object[] = Countries.getColumnsWithWidths();

    protected _onSortingChanged(e: SyntheticEvent, sorting: object[]): void {
        this._sorting = sorting;
        this._options._dataOptionsValue.SortingSelectorSortingSelectorWithReset.setState({
            sorting,
        });
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            SortingSelectorSortingSelectorWithReset: {
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
    },
});
