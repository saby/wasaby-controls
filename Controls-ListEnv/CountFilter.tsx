/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import * as React from 'react';
import { Serializer } from 'UI/State';
import { useSlice } from 'Controls-DataEnv/context';
import { IDayTemplateOptions, IStoreIdOptions } from 'Controls/interface';
import { GetFormattedDateRangeCaption, IDateMenuOptions } from 'Controls/filterPanelEditors';
import { DEFAULT_PERIODS } from 'Controls/filterDateRangeEditor';
import { getDatesByFilterItem, FilterDescription, IUserPeriod } from 'Controls/filter';
import { RecordSet } from 'Types/collection';
import { useFilterDescription } from 'Controls-ListEnv/filterBase';
import { inputDefaultContentTemplate as InputDefaultContentTemplate } from 'Controls/dropdown';
import { Selector as DropdownSelector } from 'Controls/dropdown';
import { IDayAvailableOptions } from 'Controls/calendar';
import { USER } from 'ParametersWebAPI/Scope';
import * as rk from 'i18n!Controls';
import 'css!Controls-ListEnv/CountFilter';

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
     * @name Controls-ListEnv/CountFilter#caption
     * @cfg {String} Метка, которая отображается слева от контрола
     */
    caption?: string;
    /**
     * @name Controls-ListEnv/CountFilter#datePopupOptions
     * @cfg {IDatePopupOptions} Опция для окна выбора периода.
     */
    datePopupOptions: IDatePopupOptions;
}

const DEFAULT_SELECTED_KEYS = ['dateMenu'];
const COUNT_FILTER_VALUE = 'countFilterValue';
const COUNT_FILTER_USER_PARAM_POSTFIX = '-countFilterValue';

function getSelectedItem(
    props: IDateMenuOptions,
    value: Date | Date[] | string,
    userPeriods: IUserPeriod[] = []
): { key: string; title: string; value?: Date[]; order?: number } | void {
    if (props.items) {
        return props.items.getRecordById(value);
    }
    return DEFAULT_PERIODS.concat(userPeriods).find(({ key }) => {
        if (!props.excludedPeriods?.includes(key) && value === key) {
            return true;
        }
    });
}

const excludedPeriods = ['today', 'yesterday'];

function getTextValue(
    props: IDateMenuOptions,
    item,
    selectedValue,
    userPeriods
): Promise<string> | string | void {
    let textValue;
    let dates;

    if (!excludedPeriods.includes(selectedValue)) {
        dates = getDatesByFilterItem({
            name: props.name,
            value: selectedValue,
            editorOptions: {
                periodType: props.periodType,
                userPeriods,
                _date: props._date,
            },
        });
    }

    if (dates instanceof Array) {
        const startValue = dates instanceof Array ? dates[0] : dates;
        const endValue = dates instanceof Array ? dates[1] : dates;
        if (!startValue && !endValue) {
            textValue = props.extendedCaption || '';
        }

        if (startValue instanceof Date || endValue instanceof Date) {
            textValue = (props.captionFormatter || GetFormattedDateRangeCaption)(
                startValue,
                endValue,
                '',
                props._date
            );
        }
    }
    if (!textValue && item) {
        textValue = item.get ? item.get(props.displayProperty) : item.title;
    }
    return textValue;
}

/**
 * Контрол "Фильтр по счетчикам". Отображает меню с выбором даты.
 * Предоставляет возможность показывать счётчики в мастере за определённый период.
 * @remark Также для настройки контрола используйте опции списочной фабрики {@link Controls/dataFactory:IListDataFactoryArguments}:
 * * {@link Controls/dataFactory:IListDataFactoryArguments#countFilterValue}
 * * {@link Controls/dataFactory:IListDataFactoryArguments#countFilterLinkedNames}
 * * {@link Controls/dataFactory:IListDataFactoryArguments#countFilterValueConverter}
 * @class Controls-ListEnv/CountFilter
 * @mixes Controls/interface:IStoreId
 * @mixes Controls/filter:IPeriodsConfig
 * @demo Controls-ListEnv-demo/CountFilter/Index
 * @public
 */
export default React.forwardRef(function CountFilter(props: IFilterCounter, ref): JSX.Element {
    const dropdownRef = React.useRef(null);
    const slice = useSlice(props.storeId);
    const { fullFilterDescription } = useFilterDescription(props);
    const isDateFilterSelected = React.useMemo(
        () => FilterDescription.isDateRangeFilterChanged(fullFilterDescription),
        [fullFilterDescription]
    );

    const [value, setValue] = React.useState(() => {
        const selectedValue = slice.state[COUNT_FILTER_VALUE];
        if (selectedValue) {
            const item = getSelectedItem(props, selectedValue, slice.state.countFilterUserPeriods);
            return {
                selectedKey: selectedValue,
                textValue: getTextValue(
                    props,
                    item,
                    selectedValue,
                    slice.state.countFilterUserPeriods
                ),
            };
        }
    });

    const textValue = React.useMemo(() => {
        const emptyCaption = props.caption ? 'выберите период' : 'Выберите период';
        return value?.textValue || rk(emptyCaption);
    }, [value]);

    const onMenuItemClick = React.useCallback(
        (event, newValue, newTextValue) => {
            const value = newValue[0];
            const item = getSelectedItem(props, newValue[0]);
            const caption = getTextValue(props, item, newValue[0]) || newTextValue;
            setValue({
                selectedKey: value,
                textValue: caption,
            });
            const serializedValue = JSON.stringify(value, new Serializer().serialize);
            USER.set(slice.state.propStorageId + COUNT_FILTER_USER_PARAM_POSTFIX, serializedValue);
            slice.setState({
                countFilterValue: value,
            });

            dropdownRef.current?.closeMenu();
        },
        [fullFilterDescription]
    );

    const menuProps = React.useMemo(() => {
        return {
            ...props.datePopupOptions,
            viewMode: 'frequent',
            selectedKeys:
                value.selectedKey instanceof Array ? value.selectedKey : [value.selectedKey],
            onItemClick: onMenuItemClick,
            periodItemVisible: props.customPeriod,
            keyProperty: props.keyProperty,
            displayProperty: props.displayProperty,
            items: props.items,
            type: props.type,
            excludedPeriods: props.excludedPeriods,
            timePeriods: props.timePeriods,
            customPeriod: props.customPeriod,
            userPeriods: slice.state.countFilterUserPeriods,
            captionFormatter: props.captionFormatter,
            _date: props._date,
        };
    }, [
        props.datePopupOptions,
        props.customPeriod,
        props.keyProperty,
        props.displayProperty,
        props.captionFormatter,
        props.excludedPeriods,
        props.timePeriods,
        props.customPeriod,
        slice.state.countFilterUserPeriods,
        props.items,
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
    }, [menuProps, value.selectedKey, onMenuItemClick]);

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
                            tooltip={textValue}
                            text={textValue}
                        />
                    )}
                    selectedKeys={DEFAULT_SELECTED_KEYS}
                    keyProperty="key"
                    footerContentTemplate={<div></div>}
                    itemTemplate="Controls/filterPanelEditors:DateMenu"
                    fontColorStyle="link"
                    className={props.caption ? 'controls-CountFilter__withCaption' : ''}
                />
            </div>
        );
    } else {
        return null;
    }
});
