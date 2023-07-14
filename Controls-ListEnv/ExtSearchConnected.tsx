import * as React from 'react';
import {InputContainer} from 'Controls/search';
import ExtSearch from 'Controls-ListEnv/ExtSearch';
import { useFilterDescription } from 'Controls-ListEnv/filterBase';
import { isEqual } from 'Types/object';
import { IInnerWidgetOptions } from 'Controls-ListEnv/filterBase';
import { IContrastBackgroundOptions, IInputPlaceholderOptions, ISuggest } from 'Controls/interface';
import { IMaxLengthOptions } from 'Controls/input';

export interface ISearchSuggestWidgetOptions extends
    IInnerWidgetOptions,
    IContrastBackgroundOptions,
    Omit<IInputPlaceholderOptions, 'placeholderVisibility'>,
    Pick<ISuggest, 'suggestWidth'>,
    IMaxLengthOptions {
    filterNames: string[];
}

const customEvents = ['onFilterDescriptionChanged'];

function updateTextValueVisible(filterSource): void {
    filterSource.forEach((item) => {
        if (!isEqual(item.value, item.resetValue)) {
            item.textValueVisible = false;
        }
    });
}

function Content(props: ISearchSuggestWidgetOptions): JSX.Element {
    return <ExtSearch {...props} />;
}

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
 * @mixes Controls-ListEnv/ExtSearch:ISearchSuggest
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
    const {filterDescription, applyFilterDescription} = useFilterDescription(props);

    React.useMemo(() => {
        updateTextValueVisible(filterDescription);
    }, [filterDescription]);

    const filterSourceChangedInternal = React.useCallback((filterSource, additionalState) => {
        applyFilterDescription(filterSource, additionalState);
    }, [applyFilterDescription]);

    return (
        <InputContainer storeId={props.storeId}
                        attrs={props.attrs}
                        forwardedRef={ref}>
                <Content searchParam={props.searchParam}
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
                         customEvents={customEvents} />
        </InputContainer>
    );
}

export default React.forwardRef(SearchSuggestWidgetWidget);
