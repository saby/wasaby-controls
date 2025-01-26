import { RecordSet } from 'Types/collection';
import { TKey, TSourceOption, TSortingOptionValue } from 'Controls/interface';
import { QueryWhereExpression } from 'Types/source';
import { IFilterDescriptionItem } from 'Controls/filter';

export default interface ISourceControllerLoadResult {
    items: RecordSet;
    /**
     * @deprecated data для совместимости. Используйте items
     */
    data: RecordSet;
    collapsedGroups?: (string | number)[];
    source?: TSourceOption;
    error?: Error;
    filter: QueryWhereExpression<unknown>;
    sorting?: TSortingOptionValue;
    expandedItems?: TKey[];
    root?: TKey;
    filterDescription?: IFilterDescriptionItem[];
    historyItems?: IFilterDescriptionItem[];
}
