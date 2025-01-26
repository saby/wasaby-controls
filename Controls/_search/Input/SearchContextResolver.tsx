/**
 * @kaizen_zone 51901a13-bec5-4da2-8548-f6477dc9eaf6
 */
import * as React from 'react';
import { IControlOptions } from 'UI/Base';
import { wasabyAttrsToReactDom } from 'UICore/Executor';
import { SyntheticEvent } from 'UI/Events';
import { Logger } from 'UI/Utils';
import { IListState, ListSlice } from 'Controls/dataFactory';
import { IRenderOptions } from 'Controls/input';
import { useSlices, ISearchSlicesResult, TSearchSlices, TSearchStates } from './useSlices';

export interface ISearchContextResolverOptions
    extends IControlOptions,
        Pick<IRenderOptions, 'onInputCompleted'> {
    storeId: string | string[] | undefined;
    dataName?: string;
    forwardedRef?: React.ForwardedRef<unknown>;
    onResetClick?: () => void;
    attrs?: Record<string, unknown>;
}

type TSearchContextResolverWrappedProps = ISearchContextResolverOptions & ISearchSlicesResult;

const CUSTOM_EVENTS = [
    'onSearch',
    'onSearchReset',
    'onInputSearchValueChanged',
    'onValueChanged',
    'onSearchClick',
];

class SearchContextResolverWrapped extends React.Component<TSearchContextResolverWrappedProps> {
    constructor(props: TSearchContextResolverWrappedProps) {
        super(props);
        if (props.storeId) {
            const slices = props.slices;
            this._validateSlices(slices);

            this._search = this._search.bind(this);
            this._resetSearch = this._resetSearch.bind(this);
            this._inputSearchValueChanged = this._inputSearchValueChanged.bind(this);
            this._searchClick = this._searchClick.bind(this);
        }
    }
    private _validateSlices(slices: TSearchSlices): void {
        const missedSearchParam: string[] = [];
        let incorrectSliceType = false;
        let hasCompatibleSlice = false;
        Object.entries(slices).forEach(([key, slice]) => {
            if (!(slice['[ISearchSlice]'] || slice['[IListSlice]'])) {
                incorrectSliceType = true;
            } else if (slice['[IListSlice]'] && !slice.state.searchParam) {
                missedSearchParam.push(key);
            }
            if (slice['[ICompatibleSlice]']) {
                hasCompatibleSlice = true;
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
        if (hasCompatibleSlice) {
            Logger.warn(
                'Для работы по схеме со storeId необходимо настроить предзагрузку данных в новом формате' +
                    " 'https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/'"
            );
        }
    }

    private _getInitialSearchValue(states: TSearchStates): string {
        let searchValue = '';
        const listWithSearchValue = Object.values(states).find((state) => {
            return !!state.searchValue;
        });
        if (listWithSearchValue) {
            searchValue = listWithSearchValue.searchValue;
        }
        return searchValue;
    }

    private _getSearchInputValueFromSlice(states: TSearchStates): string {
        let searchInputValue = '';
        const listWithSearchInputValue = Object.values(states).find((state) => {
            return !!state.searchInputValue;
        });
        if (listWithSearchInputValue) {
            searchInputValue = listWithSearchInputValue.searchInputValue;
        }
        return searchInputValue;
    }

    private _getSliceProperty(states: TSearchStates, propertyName: keyof IListState): number {
        return Object.values(states).find((state) => {
            return state[propertyName] !== undefined;
        })?.[propertyName] as number;
    }

    protected _search(value: string): void {
        Object.values(this.props.slices).forEach((slice: ListSlice) => {
            slice.search(value);
        });
    }

    protected _resetSearch(): void {
        Object.values(this.props.slices).forEach((slice: ListSlice) => {
            slice.resetSearchQuery();
        });
    }

    protected _inputSearchValueChanged(value: string): void {
        Object.values(this.props.slices).forEach((slice: ListSlice) => {
            slice.setSearchInputValue(value);
        });
    }

    private _searchClick(event: React.SyntheticEvent | SyntheticEvent): void {
        event.stopPropagation();
    }

    render(): React.ReactNode {
        const attrs = wasabyAttrsToReactDom(this.props.attrs) || {};
        if (this.props.storeId) {
            const { states } = this.props;
            const searchValue = this._getInitialSearchValue(states);
            const searchInputValue = this._getSearchInputValueFromSlice(states);
            const minSearchLength = this._getSliceProperty(states, 'minSearchLength');
            const searchDelay = this._getSliceProperty(states, 'searchDelay');

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
    ref: React.ForwardedRef<unknown>
): React.ReactElement {
    const searchSlicesResult = useSlices(props.storeId);
    return <SearchContextResolverWrapped {...props} {...searchSlicesResult} forwardedRef={ref} />;
});
