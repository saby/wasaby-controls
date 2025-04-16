import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Sorting/SortingSelector/Icons/Template';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { IContextOptionsValue } from 'Controls/context';
import { connectToDataContext } from 'Controls/contextDeprecated';
import { SyntheticEvent } from 'UI/Events';

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
            icon: 'Controls-icons/sort:icon-Man',
        },
        {
            title: 'По площади',
            paramName: 'square',
            icon: 'Controls-icons/sort:icon-Div',
        },
        {
            title: 'По плотности населения',
            paramName: 'populationDensity',
            icon: 'Controls-icons/sort:icon-Other',
        },
    ];
    protected _sorting: object[] = [{ population: 'ASC' }];
    protected _columns: IColumn[] = Countries.getColumnsWithWidths();

    protected _onSortingChanged(e: SyntheticEvent, sorting: object[]): void {
        this._sorting = sorting;
        this._options._dataOptionsValue.SortingSelectorIcons.setState({
            sorting,
        });
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            SortingSelectorIcons: {
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
