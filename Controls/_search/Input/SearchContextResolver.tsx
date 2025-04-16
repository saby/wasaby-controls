/**
 * @kaizen_zone 51901a13-bec5-4da2-8548-f6477dc9eaf6
 */
import * as React from 'react';
import { wasabyAttrsToReactDom } from 'UICore/Executor';
import { SyntheticEvent } from 'UI/Events';
import { Logger } from 'UI/Utils';
import { IListState, ListSlice } from 'Controls/dataFactory';
import { IRenderOptions } from 'Controls/input';
import { clsx } from 'clsx';
import { useSlices, ISearchSlicesResult, TSearchSlices, TSearchStates } from './useSlices';
import { IComponentProps } from 'Controls/interface';
import { IControlOptions } from 'UI/Base';

export interface ISearchContextResolverOptions
    extends IComponentProps,
        IControlOptions,
        Pick<IRenderOptions, 'onInputCompleted'> {
    storeId: string | string[] | undefined;
    slices?: Record<string, ListSlice | undefined>;
    dataName?: string;
    forwardedRef?: React.ForwardedRef<unknown>;
    onResetClick?: () => void;
    attrs?: Record<string, unknown>;
    children: React.ReactElement;
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

    private _getValueFromSlice<T extends keyof IListState>(
        states: TSearchStates,
        name: keyof IListState
    ): IListState[T] {
        let value;
        const listWithValue = Object.values(states).find((state) => {
            return !!state[name];
        });
        if (listWithValue) {
            value = listWithValue[name];
        }
        return value || '';
    }

    private _getSliceProperty(states: TSearchStates, propertyName: keyof IListState): number {
        return Object.values(states).find((state) => {
            return state[propertyName] !== undefined;
        })?.[propertyName] as number;
    }

    protected _search(value: string): void {
        this._eachSlice((slice) => slice.search(value));
    }

    protected _resetSearch(): void {
        this._eachSlice((slice) => slice.resetSearchQuery());
    }

    protected _inputSearchValueChanged(value: string): void {
        this._eachSlice((slice) => slice.setSearchInputValue(value));
    }

    protected _eachSlice(cb: (slice: ListSlice) => void) {
        Object.values(this.props.slices).forEach((slice) => cb(slice));
    }

    private _searchClick(event: React.SyntheticEvent | SyntheticEvent): void {
        // если внутри React контрол, который вызывает callback из props
        // Тогда и stopPropagation звать не надо
        event.stopPropagation?.();
    }

    render(): React.ReactNode {
        const attrs = (this.props.attrs && wasabyAttrsToReactDom(this.props.attrs)) || {};
        const propsToClone: Record<string, unknown> = {
            ...attrs,
            className: clsx(this.props.className, this.props.children.props.className),
        };
        if (this.props.forwardedRef) {
            propsToClone.forwardedRef = this.props.forwardedRef;
        }

        if (this.props.storeId) {
            const { states, children } = this.props;
            const searchInputValue = this._getValueFromSlice<'searchInputValue'>(
                states,
                'searchInputValue'
            );

            const customEvents = children.props.customEvents
                ? [...CUSTOM_EVENTS, ...children.props.customEvents]
                : CUSTOM_EVENTS;
            return React.cloneElement(children, {
                ...propsToClone,
                onSearch: this._search,
                onSearchReset: this._resetSearch,
                onInputSearchValueChanged: this._inputSearchValueChanged,
                onValueChanged: this._inputSearchValueChanged,
                onInputCompleted: this.props.onInputCompleted,
                onResetClick: this.props.onResetClick,
                onSearchClick: this._searchClick,
                customEvents,
                inputSearchValue: searchInputValue,
                minSearchLength: this._getSliceProperty(states, 'minSearchLength'),
                searchDelay: this._getSliceProperty(states, 'searchDelay'),
                value: searchInputValue,
                searchValue: this._getValueFromSlice<'searchValue'>(states, 'searchValue'),
                searchValueTrim: this._getValueFromSlice<'searchValueTrim'>(
                    states,
                    'searchValueTrim'
                ),
                dataName: this.props.dataName,
            });
        }
        return React.cloneElement(this.props.children, propsToClone);
    }
}

export default React.forwardRef(function SearchContextResolver(
    props: ISearchContextResolverOptions,
    ref: React.ForwardedRef<unknown>
): React.ReactElement {
    const searchSlicesResult = useSlices(props.storeId, props.slices);
    return <SearchContextResolverWrapped forwardedRef={ref} {...props} {...searchSlicesResult} />;
});
