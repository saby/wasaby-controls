import { IFilterDescriptionItem } from 'Controls-DataEnv/interface';
/**
 * Интерфейс опций истории фильтров
 * @public
 */
export interface IFilterHistoryOptions {
    historyId?: string;
    historyItems?: IFilterDescriptionItem[];
}
