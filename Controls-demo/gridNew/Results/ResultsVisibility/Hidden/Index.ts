import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import * as Template from 'wml!Controls-demo/gridNew/Results/ResultsVisibility/Hidden/Index';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Countries;

export default class extends Control {
    protected _template: TemplateFunction = Template;

    protected _header: IHeaderCell[] = Countries.getHeader();
    protected _columns: IColumn[] = Countries.getColumnsWithWidths(false);
    protected _resultsVisibility: boolean = true;

    protected _beforeMount(): void {
        this._columns[1].width = '224px';
    }

    protected _toggleResultsVisibility(): void {
        this._resultsVisibility = !this._resultsVisibility;
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ResultsVisibilityHidden: {
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
