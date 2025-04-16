import * as rk from 'i18n!Controls-ListEnv';
import { TemplateFunction } from 'UI/Base';
import { isComponentClass, isForwardRef } from 'UICore/Executor';
import { IStoreIdOptions } from 'Controls/interface';
import { useFilterDescriptionState } from 'Controls-ListEnv/filterBase';
import { ContinueSearchTemplate, IContinueSearchTemplateProps } from 'Controls/list';
import { IFilterItem, resetFilterItem } from 'Controls/filter';
import * as React from 'react';
import { useSliceActions } from 'Controls-DataEnv/context';
import { ListSlice } from 'Controls/dataFactory';
import { isEqual } from 'Types/object';
import { Button } from 'Controls/buttons';
import 'css!Controls/buttonsSameStyle';

/**
 * @typedef IFilterValue
 * @description Конфигурация предустановленного фильтра.
 * @property {String} value Значение фильтра
 * @property {String} textValue Текстовое представление фильтра
 */
interface IFilterValue {
    value?: IFilterItem['value'];
    textValue?: IFilterItem['textValue'];
}

export interface ISearchHintProps extends IContinueSearchTemplateProps, IStoreIdOptions {
    // Идентификатор контроллера списка в контексте
    storeId: string;
    /**
     * @cfg {String[]} Имена фильтров, которые будут выводиться в подсказке.
     * Выводятся только те фильтры, в которых выбрано значение. Чтобы добавить фильтр с предустановленным значением, используйте {@link filterValues}
     * @example
     * <pre>
     * <!-- TSX -->
     * import { View as ListView } from 'Controls/list';
     * import { Continue } from 'Controls-ListEnv/listSearchHints';
     *
     * <ListView source={viewSource} continueSearchTemplate={MyContinueSearchTemplate} />
     *
     * ...
     *
     * const SEARCH_HINT_FILTER_NAMES = ['company'];
     *
     * function MyContinueSearchTemplate(props) {
     *     return (
     *         <Continue
     *             {...props}
     *             filterNames={SEARCH_HINT_FILTER_NAMES}
     *             storeId="continueSearch"
     *         />
     *     );
     * }
     * </pre>
     */
    filterNames?: string[];
    /**
     * @cfg {IFilterValue} Значения для предустановленных фильтров, которые будут выводиться в подсказке.
     * @example
     * <pre>
     * <!-- TSX -->
     * import { View as ListView } from 'Controls/list';
     * import { Continue } from 'Controls-ListEnv/listSearchHints';
     *
     * <ListView source={viewSource} continueSearchTemplate={MyContinueSearchTemplate} />
     *
     * ...
     *
     * const SEARCH_HINT_FILTER_NAMES = ['deleted', 'company'];
     * const FILTER_VALUES = {
     *     deleted: {
     *         value: true,
     *         textValue: 'Удаленные',
     *     },
     * };
     *
     * function MyContinueSearchTemplate(props) {
     *     return (
     *         <Continue
     *             {...props}
     *             filterNames={SEARCH_HINT_FILTER_NAMES}
     *             filterValues={FILTER_VALUES}
     *             storeId="continueSearch"
     *         />
     *     );
     * }
     * </pre>
     */
    filterValues?: Record<string, IFilterValue>;
}

export default function Continue(props: ISearchHintProps) {
    return (
        <ContinueSearchTemplate
            continueSearchCaption={props.continueSearchCaption}
            message={props.message}
            item={props.item}
            position={props.position}
            positionHint={props.positionHint}
            footerTemplate={props.footerTemplate}
            details={
                <FiltersWithDetailTemplate
                    storeId={props.storeId}
                    filterNames={props.filterNames}
                    filterValues={props.filterValues}
                    details={props.details}
                    item={props.item}
                />
            }
        />
    );
}

function FiltersWithDetailTemplate(
    props: Pick<ISearchHintProps, 'storeId' | 'filterNames' | 'details' | 'item' | 'filterValues'>
) {
    const slice = useSliceActions<ListSlice>(props.storeId);

    const details = useContentTemplate(props.details, props.item);
    const { filterDescription } = useFilterDescriptionState(props);

    const onFilterItemClick = React.useCallback(
        (item) => {
            let filterItem = {
                ...filterDescription.find(({ name }) => item.name === name),
            } as IFilterItem;
            const filterValue = props.filterValues?.[item.name];
            if (filterValue) {
                filterItem.value = filterValue.value;
                filterItem.textValue = filterValue.textValue;
            } else {
                filterItem = resetFilterItem(filterItem);
            }
            slice?.applyFilterDescription([filterItem]);
        },
        [slice, props.filterValues, filterDescription]
    );

    const filterButtons = React.useMemo(() => {
        const filterValues: (IFilterValue & { name: string })[] = [];
        filterDescription?.forEach((item) => {
            const filterValue = props.filterValues?.[item.name];
            const isResetedFilter = isEqual(item.value, item.resetValue);
            if (filterValue && isResetedFilter) {
                filterValues.push({
                    name: item.name,
                    ...filterValue,
                });
            } else if (!filterValue && !isResetedFilter) {
                filterValues.push({
                    name: item.name,
                    value: item.value,
                    textValue: item.textValue,
                });
            }
        });
        return filterValues.map((item) => {
            return (
                <Button
                    caption={item.textValue}
                    fontSize="xl"
                    viewMode="filled-same"
                    buttonStyle="secondary"
                    onClick={() => onFilterItemClick(item)}
                    key={item.name}
                    className="controls-margin_left-s"
                />
            );
        });
    }, [filterDescription, props.filterValues, onFilterItemClick]);

    return (
        <>
            {filterButtons?.length ? (
                <div className="tw-flex tw-items-baseline controls-padding_top-s">
                    <span>{rk('или выбрать фильтр')}</span>
                    {filterButtons}
                </div>
            ) : null}
            {details && <div>{details}</div>}
        </>
    );
}

function useContentTemplate(
    ContentTemplate: TemplateFunction | React.ComponentType | string | React.ReactElement,
    item: ISearchHintProps['item']
) {
    return React.useMemo(() => {
        if (!ContentTemplate) {
            return;
        }
        if (
            typeof ContentTemplate === 'function' ||
            isComponentClass(ContentTemplate) ||
            isForwardRef(ContentTemplate)
        ) {
            return <ContentTemplate item={item} />;
        }
        if (typeof ContentTemplate === 'object') {
            return React.cloneElement(ContentTemplate, { item });
        }
        return ContentTemplate;
    }, [ContentTemplate, item]);
}
