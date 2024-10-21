/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import { IBaseLoadDataConfig } from './IDataLoadProvider';

export interface ILoadDataCustomConfig extends IBaseLoadDataConfig {
    id?: string;
    type?: 'custom';
    loadDataMethod?: Function;
    loadDataMethodArguments?: object;
    dependencies?: string[];
}
