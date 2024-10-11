/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import * as React from 'react';
import { SyntheticEvent } from 'Vdom/Vdom';
import Async from 'Controls/Container/Async';
import { RecordSet } from 'Types/collection';
import { Memory } from 'Types/source';
import getMenuItems from './GetMenuItems';
import getSelectedKeysByValue from './GetSelectedKeysByValue';
import getTextValue from './GetTextValue';
import { onItemClick } from './ItemClickHandler';
import { IEmptyItemOptions } from 'Controls/dropdown';
import { IRangeSelectableOptions } from 'Controls/dateRange';
import { IDayAvailableOptions } from 'Controls/calendar';
import 'css!Controls/filterPanelEditors';
import { IPeriodsConfig } from 'Controls/filter';
import MenuItemTemplate from 'Controls/_filterPanelEditors/DateMenu/MenuItemTemplate';
import { isLoaded, loadAsync } from 'WasabyLoader/ModulesLoader';

const POPUP_CLASS_NAME = 'controls-DateMenuEditor-frequent-popup_shift';
const customEvents = ['onItemClick'];
const FILTER_DATE_RANGE = 'Controls/filterDateRangeEditor';

interface IDateEditorFrequentOptions
    extends IEmptyItemOptions,
        IRangeSelectableOptions,
        IDayAvailableOptions,
        IPeriodsConfig {
    periodItemVisible?: boolean;
    resetValue?: string[] | Date[];
    selectedKeys: string[] | Date[];
    items?: RecordSet;
    dateMenuItems?: RecordSet;
    captionFormatter?: Function;
    displayProperty?: string;
    keyProperty?: string;
    viewMode?: string;
    onItemClick?: Function;
    extendedCaption?: string;
    shouldPositionBelow?: boolean;
}

function itemClickCallback(onItemClick: Function, value: Date[], textValue: string): void {
    onItemClick?.(
        new SyntheticEvent(null, {
            type: 'propertyValueChanged',
        }),
        value,
        textValue
    );
}

function periodChanged(
    props: Partial<IDateEditorFrequentOptions>,
    startValue: Date,
    endValue: Date
): void {
    if (startValue || endValue || props.extendedCaption) {
        const textValue = getTextValue(props, null, [startValue, endValue]);
        if (props.selectionType === 'single') {
            itemClickCallback(props.onItemClick, [startValue], textValue);
        } else {
            itemClickCallback(props.onItemClick, [[startValue, endValue]], textValue);
        }
    }
}

/**
 * Контрол используют в качестве редактора для поля фильтра с типом Date, отображается в виде меню.
 * @class Controls/_filterPanelEditors/DateMenuFrequent
 * @mixes Controls/date:Input
 * @mixes Controls/filter:IPeriodsConfig
 * @private
 */

const DateEditorFrequent = React.forwardRef(
    (props: IDateEditorFrequentOptions, ref: React.ForwardedRef<unknown>) => {
        const [isNewPeriodTypes] = React.useState(!props.dateMenuItems && !props.items);
        const [items, setItems] = React.useState<RecordSet>(() =>
            !isNewPeriodTypes || isLoaded(FILTER_DATE_RANGE) ? getMenuItems(props) : null
        );

        React.useEffect(() => {
            if (isNewPeriodTypes && !isLoaded(FILTER_DATE_RANGE)) {
                loadAsync(FILTER_DATE_RANGE).then(() => {
                    setItems(getMenuItems(props));
                });
            } else {
                setItems(getMenuItems(props));
            }
        }, [
            props.keyProperty,
            props.displayProperty,
            props.dateMenuItems,
            props.items,
            props.periodType,
            props.excludedPeriods,
            props.timePeriods,
            props.customPeriod,
            props.periodItemVisible,
            props.userPeriods,
            props.selectionType,
        ]);

        const [selectedKeys, source] = React.useMemo(() => {
            const propertyValue =
                props.selectedKeys instanceof Array ? props.selectedKeys[0] : props.selectedKeys;
            const resetValue =
                props.resetValue instanceof Array ? props.resetValue[0] : props.resetValue;
            const selectedKeys = getSelectedKeysByValue({
                propertyValue,
                resetValue,
            });
            const source = new Memory({
                data: items.getRawData(),
                keyProperty: isNewPeriodTypes ? 'key' : props.keyProperty,
            });
            return [selectedKeys, source];
        }, [
            items,
            props.selectedKeys,
            props.resetValue,
            props.emptyText,
            props.emptyKey,
            props.keyProperty,
        ]);

        const targetRef = React.useRef();

        const periodChangedCallback = React.useCallback(
            (startValue: Date, endValue: Date) => {
                periodChanged(
                    {
                        extendedCaption: props.extendedCaption,
                        captionFormatter: props.captionFormatter,
                        selectionType: props.selectionType,
                        onItemClick: props.onItemClick,
                    },
                    startValue,
                    endValue
                );
            },
            [props.extendedCaption, props.captionFormatter, props.selectionType, props.onItemClick]
        );

        const selectedItemCallback = React.useCallback(
            (clickedItem) => {
                const key = clickedItem.getKey();
                const itemClick = (textValue, value) =>
                    itemClickCallback(props.onItemClick, value || [key], textValue);

                if (isNewPeriodTypes) {
                    const textValue = getTextValue(props, items, key);
                    itemClick(textValue || clickedItem.get(props.displayProperty), [key]);
                } else {
                    itemClick(clickedItem.get(props.displayProperty));
                }
            },
            [props.displayProperty, props.onItemClick]
        );

        const templateOptions = React.useMemo(() => {
            return {
                selectedKeys,
                markerVisibility: 'onactivated',
                source,
                ref: (element) => {
                    targetRef.current = element;
                    if (ref) {
                        ref(element);
                    }
                },
                displayProperty: props.displayProperty,
                keyProperty: isNewPeriodTypes ? 'key' : props.keyProperty,
                itemTemplate: isNewPeriodTypes
                    ? (contentProps) => {
                          return (
                              <MenuItemTemplate
                                  {...contentProps}
                                  periodType={props.periodType}
                                  userPeriods={props.userPeriods}
                                  captionFormatter={props.captionFormatter}
                                  _date={props._date}
                              />
                          );
                      }
                    : 'Controls/menu:ItemTemplate',
                itemPadding: {
                    right: 'menu-close',
                },
                emptyText: props.emptyText,
                emptyKey: props.emptyKey,
            };
        }, [
            selectedKeys,
            props.displayProperty,
            props.keyProperty,
            props.emptyText,
            props.emptyKey,
        ]);

        const datePopupProps = React.useMemo(() => {
            return {
                editorMode: props.editorMode,
                selectionType: props.selectionType,
                isDayAvailable: props.isDayAvailable,
                minRange: props.minRange,
                ranges: props.ranges,
                mask: props.mask,
                dayTemplate: props.dayTemplate,
                startValueValidators: props.startValueValidators,
                endValueValidators: props.endValueValidators,
                resetEndValue: props.resetEndValue,
                resetStartValue: props.resetStartValue,
                propertyValue: props.selectedKeys,
                chooseHalfyears: props.chooseHalfyears,
                chooseMonths: props.chooseMonths,
                chooseQuarters: props.chooseQuarters,
                chooseYears: props.chooseYears,
                shouldPositionBelow: props.shouldPositionBelow,
            };
        }, [
            props.editorMode,
            props.selectionType,
            props.isDayAvailable,
            props.minRange,
            props.ranges,
            props.mask,
            props.dayTemplate,
            props.startValueValidators,
            props.endValueValidators,
            props.resetEndValue,
            props.resetStartValue,
            props.selectedKeys,
            props.chooseHalfyears,
            props.chooseMonths,
            props.chooseQuarters,
            props.chooseYears,
            props.shouldPositionBelow,
        ]);
        const onItemClickHandler = React.useCallback(
            (item, event) => {
                event.stopPropagation();
                onItemClick(item, {
                    ...datePopupProps,
                    selectedKeys,
                    popupClassName: POPUP_CLASS_NAME,
                    periodChangedCallback,
                    selectedItemCallback,
                    openerControl: event.currentTarget,
                    targetContainer: event.currentTarget,
                });
            },
            [periodChangedCallback, selectedItemCallback, datePopupProps, selectedKeys]
        );

        return (
            <Async
                ref={ref}
                onItemClick={onItemClickHandler}
                customEvents={customEvents}
                templateName="Controls/menu:Control"
                templateOptions={templateOptions}
            />
        );
    }
);

DateEditorFrequent.defaultProps = {
    displayProperty: 'title',
    keyProperty: 'id',
    shouldPositionBelow: true,
};

export default DateEditorFrequent;
