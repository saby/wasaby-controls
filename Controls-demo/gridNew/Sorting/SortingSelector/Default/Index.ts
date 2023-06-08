import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Sorting/SortingSelector/Default/Default';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
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
    protected _sorting: object[] = [{ population: 'ASC' }];
    protected _columns: IColumn[] = Countries.getColumnsWithWidths();

    protected _onSortingChanged(e: SyntheticEvent, sorting: object[]): void {
        this._sorting = sorting;
        this._options._dataOptionsValue.listData.setState({
            sorting,
        });
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
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
