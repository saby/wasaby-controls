import { RecordSet } from 'Types/collection';
import { DataSet } from 'Controls/dataSource';
import { ICrud } from 'Types/source';

export type TGraphsLoadResult = RecordSet;

export interface IGraphsFactoryConfig {
    items?: RecordSet | null;
    source: ICrud;
}

export interface IGraphsSliceState {
    items?: RecordSet | null;
    dataSet: DataSet;
}
