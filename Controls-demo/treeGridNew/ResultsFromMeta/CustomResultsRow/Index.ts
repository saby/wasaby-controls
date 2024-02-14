import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/ResultsFromMeta/CustomResultsRow/CustomResultsRow';
import { HierarchicalMemory } from 'Types/source';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { IDataConfig, IListDataFactoryArguments, IListState } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';
import { ExtendedSlice } from 'Controls-demo/treeGridNew/ResultsFromMeta/CustomResultsRow/CustomFactory';

const { getData } = Flat;

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue & {
        ResultsFromMetaCustomResultsRow: ExtendedSlice & IListState;
    };
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
    protected _header: IHeaderCell[] = Flat.getHeader();
    protected _columns: IColumn[] = Flat.getColumns();

    private _updateMeta(): void {
        this._getSlice().reload();
    }

    private _setMeta(): void {
        this._getSlice().resetMetaData();
    }

    private _setResultRow(): void {
        this._getSlice().resetSingleMetaResultsField();
    }

    private _getSlice(): ExtendedSlice & IListState {
        return this._options._dataOptionsValue.ResultsFromMetaCustomResultsRow;
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ResultsFromMetaCustomResultsRow: {
                dataFactoryName:
                    'Controls-demo/treeGridNew/ResultsFromMeta/CustomResultsRow/CustomFactory',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        data: getData(),
                        parentProperty: 'parent',
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                },
            },
        };
    },
});
