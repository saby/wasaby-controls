import * as React from 'react';
import { useSlice } from 'Controls-DataEnv/context';
import { IDayTemplateOptions, IStoreIdOptions } from 'Controls/interface';
import { IFilterItem } from 'Controls/filter';
import { IDateMenuOptions } from 'Controls/filterPanelEditors';
import { RecordSet } from 'Types/collection';
import { object } from 'Types/util';
import { isEqual } from 'Types/object';
import { useFilterDescription } from 'Controls-ListEnv/filterBase';
import { inputDefaultContentTemplate as InputDefaultContentTemplate } from 'Controls/dropdown';
import { Selector as DropdownSelector } from 'Controls/dropdown';
import { QueryWhereExpression } from 'Types/source';
import { IDayAvailableOptions } from 'Controls/_calendar/interfaces/IDayAvailable';
import { period as dateRangeFormatter } from 'Types/formatter';
import { Base as DateUtil } from 'Controls/dateUtils';

interface IDatePopupOptions extends IDayTemplateOptions, IDayAvailableOptions {
    editorMode: string;
    selectionType: string;
    minRange: string;
    ranges: unknown;
    mask: string;
    startValueValidators: Function[];
    endValueValidators: Function[];
    resetEndValue?: Date;
    resetStartValue?: Date;
    chooseMonths?: boolean;
    chooseQuarters?: boolean;
    chooseHalfyears?: boolean;
    chooseYears?: boolean;
}

interface IFilterCounter extends IStoreIdOptions, IDateMenuOptions {
    /**
     * Выбранное значение фильтра
     */
    value: Date | string;
    /**
     * Метка, которая отображается слева от контрола
     */
    caption?: string;

    /* FIXME: временно, чтобы можно было задать набор записей.
         Формат определения доступных периодов делаем тут https://online.sbis.ru/opendoc.html?guid=35feac2d-4cf9-4590-a2e5-d8d36ece97dc&client=3 */
    items: RecordSet;
    /**
     * Связные фильтры. При изменении периода у этих фильтров будет изменено поле filter
     */
    linkedFilters?: string[];
    /**
     * Функция обратного вызова для получения значения фильтра.
     * Данную функцию необходимо использовать в случае, если значение поставляемое контролом
     * по каким то причинам не подходит для запроса к источнику данных. Например, метод БЛ
     * не поддерживает фильтрацию по массиву дат и ожидает значения в двух полях фильтра.
     */
    valueConverter?: (value: string | Date | Date[]) => QueryWhereExpression<unknown>;
    /**
     * Опция для окна выбора периода.
     */
    datePopupOptions: IDatePopupOptions;
}

const FILTER_PARAM = 'CalcCountBy';

function getTextValue(
    props: IDateMenuOptions,
    items: RecordSet,
    value: Date | Date[] | string
): Promise<string> | string | void {
    const item = items.getRecordById(value);
    if (item) {
        return item.get(props.displayProperty);
    } else if (value) {
        const captionFormatter = props.captionFormatter || dateRangeFormatter;
        const startValue = value instanceof Array ? value[0] : value;
        const endValue = value instanceof Array ? value[1] : value;
        if (!startValue && !endValue) {
            return props.emptyCaption || '';
        }
        return captionFormatter(
            DateUtil.isValidDate(startValue) ? startValue : null,
            DateUtil.isValidDate(endValue) ? endValue : null
        );
    }
}

/**
 * Контрол "Фильтр по счетчикам". Отображает меню с выбором даты.
 * Предоставляет возможность показывать счётчики в мастере за определённый период.
 * @demo Controls-ListEnv-demo/FilterCount/Index
 * @public
 */
export default React.forwardRef(function CountFilter(props: IFilterCounter, ref): JSX.Element {
    const dropdownRef = React.useRef(null);
    const slice = useSlice(props.storeId);
    const { fullFilterDescription } = useFilterDescription(props);
    const isDateFilterSelected = React.useMemo(
        () => dateRangeFilterSelected(fullFilterDescription),
        [fullFilterDescription]
    );

    const [value, setValue] = React.useState(() => {
        if (props.value) {
            return {
                selectedKey: props.value,
                textValue: getTextValue(props, props.items, props.value),
            };
        } else {
            const item = props.items.at(0);
            return {
                selectedKey: item?.get(props.keyProperty),
                textValue: item.get(props.displayProperty),
            };
        }
    });

    const onMenuItemClick = React.useCallback(
        (event, newValue, newTextValue) => {
            setValue({
                selectedKey: newValue[0],
                textValue: newTextValue,
            });

            const newFilterDescription = updateFilterInItems(
                'set',
                fullFilterDescription,
                props.linkedFilters,
                newValue
            );
            slice.applyFilterDescription(newFilterDescription);
            dropdownRef.current?.closeMenu();
        },
        [props.linkedFilters, fullFilterDescription]
    );

    const menuProps = React.useMemo(() => {
        return {
            ...props.datePopupOptions,
            viewMode: 'frequent',
            selectedKeys:
                value.selectedKey instanceof Array ? value.selectedKey : [value.selectedKey],
            onItemClick: onMenuItemClick,
            periodItemVisible: props.periodItemVisible,
            keyProperty: props.keyProperty,
            displayProperty: props.displayProperty,
            items: props.items,
            captionFormatter: props.captionFormatter,
        };
    }, [
        props.datePopupOptions,
        props.periodItemVisible,
        props.keyProperty,
        props.displayProperty,
        props.items,
        props.captionFormatter,
        onMenuItemClick,
        value,
    ]);

    const dropdownItems = React.useMemo(() => {
        return new RecordSet({
            keyProperty: 'key',
            rawData: [
                {
                    key: 'dateMenu',
                    itemTemplateOptions: {
                        ...menuProps,
                    },
                },
            ],
        });
    }, [menuProps, value.propertyValue, onMenuItemClick]);

    React.useEffect(() => {
        if (props.linkedFilters) {
            const newFilterDescription = updateFilterInItems(
                isDateFilterSelected ? 'reset' : 'set',
                fullFilterDescription,
                props.linkedFilters,
                value.propertyValue
            );
            slice.applyFilterDescription(newFilterDescription);
        }
    }, [isDateFilterSelected]);

    if (!isDateFilterSelected) {
        return (
            <div ref={ref} className="tw-flex tw-items-baseline controls-fontweight-normal">
                {props.caption ? (
                    <>
                        <div className="controls-text-label">{props.caption}</div>&nbsp;
                    </>
                ) : null}
                <DropdownSelector
                    ref={dropdownRef}
                    items={dropdownItems}
                    contentTemplate={(contentProps) => (
                        <InputDefaultContentTemplate
                            {...contentProps}
                            tooltip={value.textValue}
                            text={value.textValue}
                        />
                    )}
                    footerContentTemplate={<div></div>}
                    itemTemplate="Controls/filterPanelEditors:DateMenu"
                    onMenuItemClick={onMenuItemClick}
                    fontColorStyle="link"
                />
            </div>
        );
    } else {
        return null;
    }
});

function dateRangeFilterSelected(filterDescription: IFilterItem[]): boolean {
    return !!filterDescription?.find(
        ({ value, resetValue, type }) =>
            (type === 'dateRange' || type === 'date') && !isEqual(value, resetValue)
    );
}

function updateFilterInItems(
    action: 'set' | 'reset',
    fullFilterDescription: IFilterItem[],
    linkedFilters?: string[],
    newValue?: unknown
): IFilterItem[] {
    const filterDescription = object.clonePlain(fullFilterDescription, {
        processCloneable: false,
    });
    linkedFilters?.forEach((linkedFilterName) => {
        const linkedItem = filterDescription.find((item) => item.name === linkedFilterName);
        linkedItem.editorOptions = { ...linkedItem.editorOptions };
        if (action === 'set') {
            linkedItem.editorOptions = { ...linkedItem.editorOptions };
            linkedItem.editorOptions.filter = {
                ...linkedItem.editorOptions.filter,
                [FILTER_PARAM]: newValue,
            };
        } else if (action === 'reset') {
            if (linkedItem.editorOptions.filter[FILTER_PARAM]) {
                linkedItem.editorOptions.filter = { ...linkedItem.editorOptions.filter };
                delete linkedItem.editorOptions.filter[FILTER_PARAM];
            }
        }
    });
    return filterDescription;
}
