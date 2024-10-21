/**
 * @kaizen_zone b0b89be4-c1d3-4c01-b582-da3ab8918ca1
 */

import * as React from 'react';
import { InputSearchContextResolver } from 'Controls/search';
import ExtSearch from 'Controls-ListEnv/ExtSearch';
import { useFilterDescription } from 'Controls-ListEnv/filterBase';
import { IContrastBackgroundOptions, IInputPlaceholderOptions, ISuggest } from 'Controls/interface';
import { IMaxLengthOptions } from 'Controls/input';
import { useSearchConnectedFocus } from 'Controls-ListEnv/searchConnected';

export interface ISearchSuggestWidgetOptions
    extends IContrastBackgroundOptions,
        Omit<IInputPlaceholderOptions, 'placeholderVisibility'>,
        Pick<ISuggest, 'suggestWidth'>,
        IMaxLengthOptions {
    filterNames: string[];
}

const customEvents = ['onFilterDescriptionChanged'];

const Content = React.forwardRef((props: ISearchSuggestWidgetOptions, ref): JSX.Element => {
    return <ExtSearch {...props} forwardedRef={ref} />;
});

/**
 * Контрол - "Поиск с подсказками". Отображает строку поиска с настройками критериев поиска и возможностью выбора фильтров из автодополнения.
 *
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/search/extsearch/ руководство разработчика по настройке контрола}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/filter-and-search/ руководство разработчика по организации поиска и фильтрации в реестре}
 *
 * @class Controls-ListEnv/ExtSearchConnected
 * @extends Controls-ListEnv/ExtSearch
 * @ignore suggestTemplate
 *
 * @mixes Controls-ListEnv/filterConnected:IFilterNames
 * @mixes Controls/interface:IStoreId
 * @mixes Controls/interface:IContrastBackground
 * @mixes Controls/input:IMaxLength
 * @implements Controls/interface:IInputPlaceholder
 *
 * @public
 *
 * @demo Controls-ListEnv-demo/SuggestSearchInput/Base/Index
 *
 * @see Controls-ListEnv/SuggestSearch
 */
function SearchSuggestWidgetWidget(props: ISearchSuggestWidgetOptions, ref) {
    const { filterDescription, applyFilterDescription } = useFilterDescription(props);
    const inputRef = React.useRef<HTMLDivElement>(null);
    const slice = useSearchConnectedFocus(inputRef, props.storeId);
    React.useImperativeHandle(ref, () => {
        return inputRef.current;
    });
    const filterSourceChangedInternal = React.useCallback(
        (filterSource, additionalState) => {
            applyFilterDescription(filterSource, additionalState, 'filterSearch');
        },
        [applyFilterDescription]
    );

    const onBlurHandler = React.useCallback(() => {
        slice.setState({
            searchInputFocused: false,
        });
    }, [slice]);

    return (
        <InputSearchContextResolver
            className={props.className}
            storeId={props.storeId}
            forwardedRef={ref}
        >
            <Content
                ref={inputRef}
                attrs={props.attrs}
                searchParam={props.searchParam}
                navigation={props.navigation}
                multiSelect={props.multiSelect}
                filterDescription={filterDescription}
                filter={props.filter}
                placeholder={props.placeholder}
                footerTemplate={props.footerTemplate}
                inlineHeight={props.inlineHeight}
                maxLength={props.maxLength}
                contrastBackground={props.contrastBackground}
                suggestWidth={props.suggestWidth}
                searchDelay={props.searchDelay}
                onFilterDescriptionChanged={filterSourceChangedInternal}
                customEvents={customEvents}
                onBlur={onBlurHandler}
                rightFieldTemplate={props.rightFieldTemplate}
                searchButtonVisible={props.searchButtonVisible}
                onSuggestOpen={props.onSuggestOpen}
                onSuggestClose={props.onSuggestClose}
            />
        </InputSearchContextResolver>
    );
}

export default React.forwardRef(SearchSuggestWidgetWidget);

/**
 * @name Controls-ListEnv/ExtSearchConnected#suggestWidth
 * @cfg {String} Ширина автодополнения в px
 */
