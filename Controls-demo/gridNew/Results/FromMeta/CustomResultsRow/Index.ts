import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Results/FromMeta/CustomResultsRow/CustomResultsRow';
import { Memory } from 'Types/source';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';
import { ExtendedSlice } from 'Controls-demo/gridNew/Results/FromMeta/CustomFactory';

const { getData } = Countries;

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue & {
        ResultsFromMetaCustomResultsRow: ExtendedSlice;
    };
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
    protected _header: IHeaderCell[] = Countries.getHeader();
    protected _columns: IColumn[] = Countries.getColumnsWithWidths();

    private _updateMeta(): void {
        this._getSlice().reload();
    }

    private _setMeta(): void {
        this._getSlice().resetMetaData();
    }

    private _setResultRow(): void {
        this._getSlice().resetSingleMetaResultsField('population');
    }

    private _getSlice(): ExtendedSlice {
        return this._options._dataOptionsValue.ResultsFromMetaCustomResultsRow;
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ResultsFromMetaCustomResultsRow: {
                dataFactoryName: 'Controls-demo/gridNew/Results/FromMeta/CustomFactory',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
        };
    },
});
