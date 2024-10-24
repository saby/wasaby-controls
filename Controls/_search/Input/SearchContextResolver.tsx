/**
 * @kaizen_zone 51901a13-bec5-4da2-8548-f6477dc9eaf6
 */
import * as React from 'react';
import { IControlOptions } from 'UI/Base';
import { wasabyAttrsToReactDom } from 'UICore/Executor';
import { IStoreIdOptions } from 'Controls/interface';
import { Logger } from 'UI/Utils';
import { ListSlice } from 'Controls/dataFactory';
import useSlices from './useSlices';

export interface ISearchContextResolverOptions extends IStoreIdOptions, IControlOptions {
    slices: TSlices;
}

type TSlices = Record<string, ListSlice>;

const CUSTOM_EVENTS = [
    'onSearch',
    'onSearchReset',
    'onInputSearchValueChanged',
    'onValueChanged',
    'onSearchClick',
];

class SearchContextResolverWrapped<
    IProps = ISearchContextResolverOptions,
> extends React.Component<IProps> {
    private _validateSlices(slices: TSlices): void {
        const missedSearchParam = [];
        let incorrectSliceType = false;
        Object.entries(slices).forEach(([key, slice]) => {
            if (!(slice['[ISearchSlice]'] || slice['[IListSlice]'])) {
                incorrectSliceType = true;
            } else if (slice['[IListSlice]'] && !slice.state.searchParam) {
                missedSearchParam.push(key);
            }
        });
        if (incorrectSliceType) {
            Logger.error(
                'SearchContextResolver:: указан неверный слайс для поиска. ' +
                    'Должен быть Controls/dataFactory:List или Controls-ListEnv/searchDataFactory/Slice'
            );
        }
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
            return !!slice.state.searchValue;
        });
        if (listWithSearchValue) {
            searchValue = listWithSearchValue.state.searchValue;
        }
        return searchValue;
    }

    private _getSearchInputValueFromSlice(slices: TSlices): string {
        let searchInputValue = '';
        const listWithSearchInputValue = Object.values(slices).find((slice) => {
            return !!slice.state.searchInputValue;
        });
        if (listWithSearchInputValue) {
            searchInputValue = listWithSearchInputValue.state.searchInputValue;
        }
        return searchInputValue;
    }

    private _getSliceProperty(slices: TSlices, propertyName: string): number {
        return Object.values(slices).find((slice) => {
            return slice.state[propertyName] !== undefined;
        })?.[propertyName];
    }

    constructor(props?: ISearchContextResolverOptions) {
        super(props);
        if (props.storeId) {
            const slices = props.slices;
            this._validateSlices(slices);

            Object.keys(slices).forEach((key) => {
                if (slices[key]['[ICompatibleSlice]']) {
                    Logger.warn(
                        'Для работы по схеме со storeId необходимо настроить предзагрузку данных в новом формате' +
                            " 'https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/'"
                    );
                }
            });
            this._search = this._search.bind(this);
            this._resetSearch = this._resetSearch.bind(this);
            this._inputSearchValueChanged = this._inputSearchValueChanged.bind(this);
            this._searchClick = this._searchClick.bind(this);
        }
    }

    protected _search(value: string): void {
        Object.values(this.props.slices).forEach((slice: IBrowserSlice) => {
            slice.search(value);
        });
    }

    protected _resetSearch(): void {
        Object.values(this.props.slices).forEach((slice: IBrowserSlice) => {
            slice.resetSearchQuery();
        });
    }

    protected _inputSearchValueChanged(value: string): void {
        Object.values(this.props.slices).forEach((slice: IBrowserSlice) => {
            slice.setSearchInputValue(value);
        });
    }

    private _searchClick(event): void {
        event.stopPropagation();
    }

    render(): React.ReactNode {
        const attrs = wasabyAttrsToReactDom(this.props.attrs) || {};
        if (this.props.storeId) {
            const { slices } = this.props;
            const searchValue = this._getInitialSearchValue(slices);
            const searchInputValue = this._getSearchInputValueFromSlice(slices);
            const minSearchLength = this._getSliceProperty(slices, 'minSearchLength');
            const searchDelay = this._getSliceProperty(slices, 'searchDelay');
            const customEvents = this.props.children.props.customEvents
                ? [...CUSTOM_EVENTS, ...this.props.children.props.customEvents]
                : CUSTOM_EVENTS;
            return React.cloneElement(this.props.children, {
                ...attrs,
                forwardedRef: this.props.forwardedRef,
                onSearch: this._search,
                onSearchReset: this._resetSearch,
                onInputSearchValueChanged: this._inputSearchValueChanged,
                onValueChanged: this._inputSearchValueChanged,
                onInputCompleted: this.props.onInputCompleted,
                onResetClick: this.props.onResetClick,
                onSearchClick: this._searchClick,
                customEvents,
                inputSearchValue: searchInputValue,
                minSearchLength,
                searchDelay,
                value: searchInputValue,
                searchValue,
                className: this.props.className,
                dataName: this.props.dataName,
            });
        }
        return React.cloneElement(this.props.children, {
            ...attrs,
            forwardedRef: this.props.forwardedRef,
            className: this.props.className,
        });
    }
}

export default React.forwardRef(function SearchContextResolver(
    props: ISearchContextResolverOptions,
    ref
): React.ReactElement {
    const slices = useSlices(props.storeId);
    return <SearchContextResolverWrapped {...props} slices={slices} forwardedRef={ref} />;
});
