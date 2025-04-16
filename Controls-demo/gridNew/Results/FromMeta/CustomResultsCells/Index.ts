import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Results/FromMeta/CustomResultsCells/CustomResultsCells';
import * as sqResTpl from 'wml!Controls-demo/gridNew/Results/FromMeta/CustomResultsCells/resultCell';
import * as defResTpl from 'wml!Controls-demo/gridNew/Results/FromMeta/CustomResultsCells/resultCellDefault';
import { Memory } from 'Types/source';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';
import { ExtendedSlice } from 'Controls-demo/gridNew/Results/FromMeta/CustomFactory';

const { getData } = Countries;

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue & {
        ResultsFromMetaCustomResultsCells: ExtendedSlice;
    };
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
    protected _header: IHeaderCell[] = Countries.getHeader();
    protected _columns: IColumn[] = Countries.getColumnsWithWidths().map((c, i) => {
        return {
            ...c,
            result: undefined,
            // eslint-disable-next-line
            resultTemplate: i === 4 ? sqResTpl : i === 5 ? defResTpl : undefined,
        };
    });

    protected _updateMeta(): void {
        this._getSlice().reload();
    }

    protected _setMeta(): void {
        this._getSlice().resetMetaData();
    }

    protected _setResultRow(): void {
        this._getSlice().resetSingleMetaResultsField('square');
    }

    private _getSlice(): ExtendedSlice {
        return this._options._dataOptionsValue.ResultsFromMetaCustomResultsCells;
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ResultsFromMetaCustomResultsCells: {
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
