import { RecordSet } from 'Types/collection';
import { DataSet } from 'Controls/dataSource';
import { TSourceOption } from 'Controls/interface';

export type TGraphsLoadResult = RecordSet;

export interface IGraphsFactoryConfig {
    items?: RecordSet | null;
    source: TSourceOption;
}

export interface IGraphsSliceState {
    items?: RecordSet | null;
    dataSet: DataSet;
}
