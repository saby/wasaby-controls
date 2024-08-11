import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Results/ResultsTemplateOptions/ResultsTemplateOptions';
import * as ResultTemplate from 'wml!Controls-demo/gridNew/Results/ResultsTemplateOptions/ResultsWithOptions';
import { Memory } from 'Types/source';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

const { getData } = Countries;

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _header: IHeaderCell[] = Countries.getHeader();
    protected _columns: IColumn[] = Countries.getColumnsWithWidths();
    protected _resultsTemplateOptions: { myVar: number } = { myVar: -1 };

    protected _beforeMount(): void {
        this._columns[5].resultTemplate = ResultTemplate;
        this._updateOption();
    }

    protected _onClick(): void {
        this._updateOption();
    }

    private _updateOption(): void {
        this._resultsTemplateOptions = {
            ...this._resultsTemplateOptions,
            myVar: this._resultsTemplateOptions.myVar + 1,
        };
        this._columns[3].resultTemplateOptions = { fontColorStyle: 'success' };
        this._columns[5].resultTemplateOptions = this._resultsTemplateOptions;
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ResultsTemplateOptions: {
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
