import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/CustomPosition/CustomPosition';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import * as cellTemplate from 'wml!Controls-demo/gridNew/CustomPosition/CellTemplate';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

function getData() {
    return Countries.getData().slice(0, 7);
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
    private _columns: IColumn[] = [
        {
            displayProperty: 'number',
            width: '50px',
        },
        {
            displayProperty: 'country',
            width: '200px',
        },
        {
            displayProperty: 'capital',
            width: '100px',
        },
        {
            width: '50px',
            template: cellTemplate,
        },
        {
            displayProperty: 'population',
            width: '150px',
        },
    ];
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ColumnScrollCustomPosition: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    selectedKeys: [0, 2],
                    multiSelectVisibility: 'onhover',
                },
            },
        };
    },
});
