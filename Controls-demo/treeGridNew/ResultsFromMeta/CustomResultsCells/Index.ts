import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/ResultsFromMeta/CustomResultsCells/CustomResultsCells';
import * as resTpl from 'wml!Controls-demo/treeGridNew/ResultsFromMeta/CustomResultsCells/resultCell';
import { HierarchicalMemory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';
import { IDataConfig, IListDataFactoryArguments, IListState } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';
import { ExtendedSlice } from '../CustomFactory';

const { getData } = Flat;

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue & {
        ResultsFromMetaCustomResultsCells: ExtendedSlice & IListState;
    };
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
    protected _header: IHeaderCell[] = Flat.getHeader();
    protected _columns: IColumn[] = Flat.getColumns().map((c, i) => {
        return {
            ...c,
            result: undefined,
            resultTemplate: i === 1 ? resTpl : undefined,
        };
    });

    private _updateMeta(): void {
        this._getSlice().reload();
    }

    private _setMeta(): void {
        this._getSlice().resetMetaData();
    }

    private _getSlice(): ExtendedSlice & IListState {
        return this._options._dataOptionsValue.ResultsFromMetaCustomResultsCells;
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ResultsFromMetaCustomResultsCells: {
                dataFactoryName:
                    'Controls-demo/treeGridNew/ResultsFromMeta/CustomResultsCells/CustomFactory',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new HierarchicalMemory({
                        keyProperty: 'key',
                        parentProperty: 'parent',
                        data: getData(),
                    }),
                    keyProperty: 'key',
                    parentProperty: 'parent',
                    nodeProperty: 'type',
                },
            },
        };
    },
});
