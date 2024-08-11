import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IColumn, IHeaderCell } from 'Controls/grid';
import * as Template from 'wml!Controls-demo/gridNew/Results/SingleRecordResults/Visible/Visible';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

function getData() {
    return Countries.getData().slice(0, 1);
}

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _header: IHeaderCell[] = Countries.getHeader();
    protected _columns: IColumn[] = Countries.getColumnsWithWidths().map((col) => {
        switch (col.displayProperty) {
            case 'population':
                // eslint-disable-next-line
                col.result = 143420300;
                break;
            case 'square':
                // eslint-disable-next-line
                col.result = 17075200;
                break;
            case 'populationDensity':
                // eslint-disable-next-line
                col.result = 8;
                break;
        }
        return col;
    });

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ResultsSingleRecordResultsVisible: {
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
