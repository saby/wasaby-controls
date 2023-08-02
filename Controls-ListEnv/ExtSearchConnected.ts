import { TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UI/Vdom';
import * as template from 'wml!Controls-ListEnv/_ExtSearchConnected/SearchInput';
import { IFilterItem } from 'Controls/filter';
import { isEqual } from 'Types/object';
import { AbstractFilter, IInnerWidgetOptions } from 'Controls-ListEnv/filterBase';
import {connectToDataContext} from 'Controls/context';

export interface ISearchSuggestWidgetOptions extends IInnerWidgetOptions {
    filterNames: string[];
    value?: string;
    useStore?: boolean;
    storeId?: string;
}

/**
 * Виджет - "Поиск с автодополнением". Реализует UI для фильтрации через строку поиска с автодополнением.
 * В основе виджета лежит интерфейсный контрол {@link Controls-ListEnv/ExtSearch}.
 *
 * @class Controls-ListEnv/ExtSearchConnected
 * @extends Controls-ListEnv/ExtSearch
 * @ignore suggestTemplate
 *
 * @mixes Controls-ListEnv/filter:IFilterNames
 * @mixes Controls/interface:IStoreId
 *
 * @public
 *
 * @demo Controls-ListEnv-demo/SuggestSearchInput/Base/Index
 *
 * @see Controls/SuggestSearch
 */
class SearchSuggestWidgetWidget extends AbstractFilter<ISearchSuggestWidgetOptions> {
    protected _template: TemplateFunction = template;
    protected _value: string = '';

    protected _beforeMount(options: ISearchSuggestWidgetOptions): void {
        super._beforeMount(options);
        this._filterSourceChanged(this._widgetController.getFilterDescription());
    }

    protected _filterSourceChangedInternal(
        event: SyntheticEvent,
        filterDescription: IFilterItem[]
    ): void {
        this._widgetController.applyFilterDescription(filterDescription);
        this._filterSource = filterDescription;
    }

    protected _filterSourceChanged(filterDescription: IFilterItem[]): void {
        this._filterSource = filterDescription;
        this._updateTextValueVisible(filterDescription);
    }

    private _updateTextValueVisible(filterDescription: IFilterItem[]): void {
        filterDescription.forEach((item) => {
            if (!isEqual(item.value, item.resetValue)) {
                item.textValueVisible = false;
            }
        });
    }
}

export default connectToDataContext(SearchSuggestWidgetWidget);
