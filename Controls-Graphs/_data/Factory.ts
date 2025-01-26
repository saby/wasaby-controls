import { TGraphsLoadResult, IGraphsFactoryConfig } from './Types';
import { DataSet } from 'Controls/dataSource';
import { default as GraphsSlice } from './Slice';

/**
 * @private
 */
export default class GraphsFactory {
    /**
     * Фабрика данных для работы с рекордом формы.
     * @param config
     */
    static async loadData(config: IGraphsFactoryConfig): Promise<TGraphsLoadResult> {
        if (config.items) {
            return config.items;
        } else {
            const dsInstance = new DataSet({ source: config.source });
            return dsInstance.load();
        }
    }

    static slice = GraphsSlice;
}
