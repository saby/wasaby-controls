import { IGraphsSliceState, TGraphsLoadResult, IGraphsFactoryConfig } from './Types';
import { DataSet } from 'Controls/dataSource';
import { Slice } from 'Controls-DataEnv/slice';

class GraphsSlice extends Slice<IGraphsSliceState> {
    protected _initState(
        loadResult: TGraphsLoadResult,
        config: IGraphsFactoryConfig
    ): IGraphsSliceState {
        const dsInstance = new DataSet({ source: config.source });
        return {
            items: loadResult || config.items || null,
            dataSet: dsInstance,
        };
    }
}

export default GraphsSlice;
