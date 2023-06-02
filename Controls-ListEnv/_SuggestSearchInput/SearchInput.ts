import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UI/Vdom';
import * as template from 'wml!Controls-ListEnv/_SuggestSearchInput/SearchInput/SearchInput';
import { IFilterItem } from 'Controls/filter';
import { isEqual } from 'Types/object';
import { object } from 'Types/util';
import { WidgetController } from 'Controls-ListEnv/filterBase';
import { IBrowserSlice } from 'Controls/dataFactory';
import { IContextValue } from 'Controls/context';
import { Logger } from 'UI/Utils';

export interface ISearchSuggestWidgetOptions extends IControlOptions {
    filterNames: string[];
    value?: string;
    useStore?: boolean;
    storeId?: string;
    _dataOptionsValue: IContextValue;
}

/**
 * Виджет - "Поиск с автодополнением". Реализует UI для фильтрации через строку поиска с автодополнением.
 * В основе виджета лежит интерфейсный контрол {@link ExtSearch/suggest:Input}.
 *
 * @class Controls-ListEnv/SuggestSearchInput
 * @extends ExtSearch/suggest:Input
 * @ignore suggestTemplate
 *
 * @mixes Controls-ListEnv/filter:IFilterNames
 * @mixes Controls/interface:IStoreId
 *
 * @public
 *
 * @demo Engine-demo/Controls-widgets/SearchSuggest/Index
 *
 * @see Controls/SuggestSearch
 */
export default class SearchSuggestWidgetWidget extends Control<ISearchSuggestWidgetOptions> {
    protected _template: TemplateFunction = template;
    protected _value: string = '';
    protected _filterDescription: IFilterItem[] = null;
    private _widgetController: WidgetController = null;
    protected _slice: IBrowserSlice;

    protected _beforeMount(options: ISearchSuggestWidgetOptions): void {
        this._initWidgetController(options);
        if (options.storeId) {
            this._slice = options._dataOptionsValue[options.storeId];
        }

        const slice = options._dataOptionsValue[options.storeId];
        if (options.storeId && slice['[ICompatibleSlice]']) {
            Logger.warn(
                'Для работы по схеме со storeId необходимо настроить предзагрузку данных в новом формате' +
                    " 'https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/'"
            );
        } else if (options.storeId === undefined) {
            Logger.warn(
                'Для работы контрола' +
                    ' Controls-ListEnv/SuggestSearchInput необходимо указать опцию storeId'
            );
        }
    }

    protected _beforeUpdate(newOptions: ISearchSuggestWidgetOptions): void {
        if (newOptions.storeId) {
            this._slice = newOptions._dataOptionsValue[newOptions.storeId];
        }

        const changes = this._widgetController.update(newOptions);

        if (changes) {
            this._subscribeToFilterController();
        }

        if (this._options.filterNames !== newOptions.filterNames) {
            this._filterDescription = this._widgetController.getFilterSource();
        }

        if (this._options.value !== newOptions.value) {
            this._value = newOptions.value;
        }
    }

    protected _beforeUnmount(): void {
        this._widgetController
            .getFilterController()
            ?.unsubscribe(
                'filterSourceChanged',
                this._filterSourceChanged,
                this
            );
    }

    protected _filterSourceChangedInternal(
        event: SyntheticEvent,
        filterDescription: IFilterItem[]
    ): void {
        this._widgetController.applyFilterDescription(filterDescription);
        this._filterDescription = filterDescription;
    }

    protected _filterSourceChanged(
        event: SyntheticEvent,
        filterDescription: IFilterItem[]
    ): void {
        this._filterDescription = filterDescription.filter(({ name }) => {
            return this._options.filterNames.includes(name);
        });
        const newFilterDescription = object.clonePlain(this._filterDescription);
        this._updateTextValueVisible(newFilterDescription);
        if (!isEqual(newFilterDescription, this._filterDescription)) {
            this._widgetController.applyFilterDescription(newFilterDescription);
        }
    }

    protected _subscribeToFilterController(): void {
        this._widgetController
            .getFilterController()
            .unsubscribe(
                'filterSourceChanged',
                this._filterSourceChanged,
                this
            );
        this._widgetController
            .getFilterController()
            .subscribe('filterSourceChanged', this._filterSourceChanged, this);
    }

    private _initWidgetController(options: ISearchSuggestWidgetOptions): void {
        this._widgetController = new WidgetController(options);
        this._filterDescription = this._widgetController.getFilterSource();
        this._subscribeToFilterController();
    }

    private _updateTextValueVisible(filterDescription: IFilterItem[]): void {
        filterDescription.forEach((item) => {
            if (!isEqual(item.value, item.resetValue)) {
                item.textValueVisible = false;
            }
        });
    }
}
