import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { IContextOptionsValue } from 'Controls/context';
import * as template from 'wml!Controls-ListEnv/_ExpandableSearchInput/Input';

export interface IExpandableSearchOptions extends IControlOptions {
    storeId: string | string[];
    _dataOptionsValue: IContextOptionsValue;
}

/**
 * Виджет "Разворачиваемый поиск
 * @extends Controls/ExpandableSearch
 * @mixes Controls/interface:IStoreId
 * @ignoreOptions expanded value
 * @demo Engine-demo/Controls-widgets/Search/ExpandableInput/Base/Index
 * @public
 */
export default class ExpandableInput extends Control<IExpandableSearchOptions> {
    protected _template: TemplateFunction = template;
}
