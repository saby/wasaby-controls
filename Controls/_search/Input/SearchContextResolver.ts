/**
 * @kaizen_zone 51901a13-bec5-4da2-8548-f6477dc9eaf6
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_search/Input/SearchContextResolver';
import { SyntheticEvent } from 'UI/Events';
import { IBrowserSlice } from 'Controls/context';
import { TKey } from 'Controls/interface';
import { Logger } from 'UI/Utils';

export interface ISearchContextResolverOptions extends IControlOptions {
    _dataOptionsValue: Record<string, any>;
    storeId: TKey[];
}

type TSlices = Record<string, IBrowserSlice>;

export default class SearchContextResolver extends Control<ISearchContextResolverOptions> {
    protected _template: TemplateFunction = template;
    protected _inputSearchValue: string = '';
    protected _searchValue: string = '';
    protected _minSearchLength: number;
    protected _searchDelay: number;

    private _getStoreId(storeId: TKey | TKey[]): TKey[] {
        if (storeId instanceof Array) {
            return storeId;
        }
        return [storeId];
    }

    private _getSlices(options: ISearchContextResolverOptions): TSlices {
        const slices = {};
        const context = options._dataOptionsValue;
        this._getStoreId(options.storeId).forEach((id) => {
            slices[id] = context[id];
        });
        return slices;
    }

    private _validateSlices(slices: TSlices): void {
        const missedSearchParam = [];
        Object.entries(slices).forEach(([key, slice]) => {
            if (!slice.searchParam) {
                missedSearchParam.push(key);
            }
        });
        if (missedSearchParam.length) {
            Logger.error(
                `SearchContextResolver::Для списков ${missedSearchParam.join(
                    ' '
                )} не указан searchParam`
            );
        }
    }

    private _getInitialSearchValue(slices: TSlices): string {
        let searchValue = '';
        const listWithSearchValue = Object.values(slices).find((slice) => {
            return !!slice.searchValue;
        });
        if (listWithSearchValue) {
            searchValue = listWithSearchValue.searchValue;
        }
        return searchValue;
    }

    private _getSearchInputValueFromSlice(slices: TSlices): string {
        let searchInputValue = '';
        const listWithSearchInputValue = Object.values(slices).find((slice) => {
            return !!slice.searchInputValue;
        });
        if (listWithSearchInputValue) {
            searchInputValue = listWithSearchInputValue.searchInputValue;
        }
        return searchInputValue;
    }

    private _getSliceProperty(slices: TSlices, propertyName: string): number {
        return Object.values(slices).find((slice) => {
            return slice[propertyName] !== undefined;
        })?.[propertyName];
    }

    protected _beforeMount(
        options?: ISearchContextResolverOptions
    ): Promise<void> | void {
        if (options.storeId) {
            const slices = this._getSlices(options);
            this._validateSlices(slices);
            this._searchValue = this._getInitialSearchValue(slices);
            this._minSearchLength = this._getSliceProperty(
                slices,
                'minSearchLength'
            );
            this._searchDelay = this._getSliceProperty(slices, 'searchDelay');

            Object.keys(slices).forEach((key) => {
                if (slices[key]['[ICompatibleSlice]']) {
                    Logger.warn(
                        'Для работы по схеме со storeId необходимо настроить предзагрузку данных в новом формате' +
                            " 'https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/'"
                    );
                }
            });
        }
    }

    protected _beforeUpdate(newOptions: ISearchContextResolverOptions): void {
        if (newOptions.storeId) {
            const slices = this._getSlices(newOptions);
            const newSearchValue = this._getInitialSearchValue(slices);
            const newSearchInputValue =
                this._getSearchInputValueFromSlice(slices);
            const minSearchLength = this._getSliceProperty(
                slices,
                'minSearchLength'
            );
            const searchDelay = this._getSliceProperty(slices, 'searchDelay');

            if (this._searchValue !== newSearchValue) {
                this._searchValue = newSearchValue;
            }

            if (this._inputSearchValue !== newSearchInputValue) {
                this._inputSearchValue = newSearchInputValue;
            }

            if (this._minSearchLength !== minSearchLength) {
                this._minSearchLength = minSearchLength;
            }
            if (this._searchDelay !== searchDelay) {
                this._searchDelay = searchDelay;
            }
        }
    }

    protected _search(e: SyntheticEvent<Event>, value: string): void {
        e.stopPropagation();
        const slices = this._getSlices(this._options);
        Object.values(slices).forEach((slice: IBrowserSlice) => {
            slice.search(value);
        });
    }

    protected _resetSearch(e: SyntheticEvent<Event>): void {
        e.stopPropagation();
        const slices = this._getSlices(this._options);
        Object.values(slices).forEach((slice: IBrowserSlice) => {
            slice.setState({
                searchValue: '',
            });
        });
    }

    protected _inputSearchValueChanged(
        e: SyntheticEvent<Event>,
        value: string
    ): void {
        e.stopPropagation();
        this._inputSearchValue = value;
        const slices = this._getSlices(this._options);
        Object.values(slices).forEach((slice: IBrowserSlice) => {
            slice.setSearchInputValue(value);
        });
    }
}
