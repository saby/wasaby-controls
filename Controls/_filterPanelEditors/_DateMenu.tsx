/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import * as React from 'react';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Model } from 'Types/entity';
import { BaseEditor } from 'Controls/filterPanel';
import EditorTemplate from './DateMenu/EditorTemplate';
import ExtendedTemplate from './DateMenu/ExtendedTemplate';
import { BY_PERIOD_KEY, IDateMenuOptions } from './DateMenu/IDateMenu';
import getMenuItems from './DateMenu/GetMenuItems';
import getSelectedKeys from './DateMenu/GetSelectedKeysByValue';
import getTextValue, { getDates, EMPTY_CAPTION } from './DateMenu/GetTextValue';
import { onItemClick } from './DateMenu/ItemClickHandler';
import { loadAsync, isLoaded } from 'WasabyLoader/ModulesLoader';
import { RecordSet } from 'Types/collection';

/**
 * Контрол используют в качестве редактора для поля фильтра с типом Date.
 * @class Controls/_filterPanelEditors/DateMenu
 * @mixes Controls/date:Input
 * @private
 */

const FILTER_DATE_RANGE = 'Controls/filterDateRangeEditor';

function getInitCaption(selectedKeys, items, props): string {
    if (selectedKeys[0] !== BY_PERIOD_KEY) {
        return getTextValue(props, items, selectedKeys[0]) as string;
    } else {
        return props.textValue;
    }
}

function propertyValueChanged(
    onPropertyValueChanged: Function,
    newValue: string | Date | Date[],
    textValue?: string
): void {
    const extendedValue = {
        value: newValue,
        textValue,
        viewMode: 'basic',
    };
    onPropertyValueChanged?.(
        new SyntheticEvent(null, {
            type: 'propertyValueChanged',
        }),
        extendedValue
    );
}

const DateMenu = React.forwardRef((props: IDateMenuOptions, ref: React.ForwardedRef<unknown>) => {
    const dropdownRef = React.useRef(); // чтобы позвать закрытия меню после выбора периода
    const [isNewPeriodTypes] = React.useState(!props.dateMenuItems && !props.items);
    const [items, setItems] = React.useState<RecordSet>(
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
    const [selectedKeys, caption] = React.useMemo(() => {
        const selectedKeysState = getSelectedKeys(props);
        return [selectedKeysState, getInitCaption(selectedKeysState, items, props)];
    }, [
        items,
        props.viewMode,
        props.extendedCaption,
        props.propertyValue,
        props.resetValue,
        props.textValue,
        props.periodType,
        props.excludedPeriods,
        props.userPeriods,
        props.selectionType,
    ]);

    const periodChangedCallback = React.useCallback(
        (startValue: Date, endValue: Date) => {
            if (startValue || endValue) {
                const isSingle = props.selectionType === 'single';
                const valueRange = [startValue, endValue];
                propertyValueChanged(
                    props.onPropertyValueChanged,
                    isSingle ? startValue : valueRange,
                    getTextValue(props, items, BY_PERIOD_KEY, valueRange)
                );
                dropdownRef.current.closeMenu();
            }
        },
        [props.selectionType, items]
    );

    const selectedItemCallback = React.useCallback(
        (item: Model) => {
            const key = item.getKey();
            let dates;

            if (isNewPeriodTypes) {
                dates = getDates(key, props);
            }
            propertyValueChanged(
                props.onPropertyValueChanged,
                key,
                getTextValue(props, items, key, dates)
            );
        },
        [props.selectionType, props.displayProperty, items]
    );

    const datePopupProps = React.useMemo(() => {
        return {
            selectedKeys,
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
            validateByFocusOut: props.validateByFocusOut,
            propertyValue: props.propertyValue,
            editorMode: props.editorMode,
            shouldPositionBelow: props.shouldPositionBelow,
        };
    }, [
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
        props.editorMode,
        props.shouldPositionBelow,
        selectedKeys,
    ]);

    const onItemClickHandler = React.useCallback(
        (item, originEvent) => {
            return onItemClick(item, {
                ...datePopupProps,
                openerControl: originEvent.currentTarget,
                targetContainer: originEvent.currentTarget,
                selectedItemCallback,
                periodChangedCallback,
            });
        },
        [
            selectedItemCallback,
            periodChangedCallback,
            datePopupProps,
            props.propertyValue,
            props.editorMode,
        ]
    );

    const templateOptions = React.useMemo(() => {
        return {
            emptyText:
                props.emptyText ||
                (isNewPeriodTypes && props.resetValue !== undefined && !props.userPeriods
                    ? EMPTY_CAPTION
                    : null),
            emptyKey: props.emptyKey,
            viewMode: props.viewMode,
            filterViewMode: props.filterViewMode,
            filterIndex: props.filterIndex,
            fontColorStyle: props.fontColorStyle || 'filter',
            fontSize: props.fontSize,
            keyProperty: isNewPeriodTypes ? 'key' : props.keyProperty,
            displayProperty: props.displayProperty,
            extendedCaption: props.extendedCaption,
            itemTemplate: props.itemTemplate,
            shouldPositionBelow: props.shouldPositionBelow,
            periodType: props.periodType,
            userPeriods: props.userPeriods,
            _date: props._date,
            onItemClick: onItemClickHandler,
            caption,
            items,
            selectedKeys,
            isNewPeriodTypes,
            dropdownRef,
        };
    }, [
        props.viewMode,
        props.filterViewMode,
        props.filterIndex,
        props.fontColorStyle,
        props.fontSize,
        props.keyProperty,
        props.displayProperty,
        props.shouldPositionBelow,
        props.periodType,
        props.userPeriods,
        props.emptyText,
        props.emptyKey,
        caption,
        items,
        selectedKeys,
        onItemClickHandler,
        isNewPeriodTypes,
    ]);

    return (
        <BaseEditor
            ref={ref}
            attrs={props.attrs}
            propertyValue={props.propertyValue}
            resetValue={props.resetValue}
            viewMode={props.viewMode}
            extendedCaption={props.extendedCaption}
            onPropertyValueChanged={props.onPropertyValueChanged}
            closeButtonVisible={props.closeButtonVisible}
            className={props.attrs?.className || props.className}
            editorTemplate={EditorTemplate}
            editorTemplateOptions={templateOptions}
            extendedTemplate={ExtendedTemplate}
            extendedTemplateOptions={templateOptions}
        />
    );
});

DateMenu.defaultProps = {
    displayProperty: 'title',
    keyProperty: 'id',
    shouldPositionBelow: true,
};

export default DateMenu;
