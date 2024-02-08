/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import * as React from 'react';
import { SyntheticEvent } from 'Vdom/Vdom';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { BaseEditor } from 'Controls/filterPanel';
import EditorTemplate from './DateMenu/EditorTemplate';
import ExtendedTemplate from './DateMenu/ExtendedTemplate';
import { BY_PERIOD_KEY, IDateMenuOptions } from './DateMenu/IDateMenu';
import getMenuItems from './DateMenu/GetMenuItems';
import getSelectedKeys from './DateMenu/GetSelectedKeysByValue';
import { onItemClick } from './DateMenu/ItemClickHandler';
import { loadAsync } from 'WasabyLoader/ModulesLoader';

/**
 * Контрол используют в качестве редактора для поля фильтра с типом Date.
 * @class Controls/_filterPanelEditors/DateMenu
 * @mixes Controls/date:Input
 * @private
 */

function getTextValue(
    options: IDateMenuOptions,
    items: RecordSet,
    selectedKeys: string[],
    value: Date | Date[]
): Promise<string> | string {
    const item = items.getRecordById(selectedKeys[0]);
    if (item && selectedKeys[0] !== BY_PERIOD_KEY) {
        return item.get(options.displayProperty);
    } else if (value) {
        return loadAsync('Controls/dateRange').then(({ Utils }) => {
            const captionFormatter = options.captionFormatter || Utils.formatDateRangeCaption;
            const startValue = value instanceof Array ? value[0] : value;
            const endValue = value instanceof Array ? value[1] : value;
            return captionFormatter(startValue, endValue, options.extendedCaption);
        });
    }
}

function getInitCaption(selectedKeys, items, props): string {
    if (selectedKeys[0] !== BY_PERIOD_KEY) {
        return getTextValue(props, items, selectedKeys) as string;
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
    const [items, selectedKeys, caption] = React.useMemo(() => {
        const itemsState = getMenuItems(props);
        const selectedKeysState = getSelectedKeys(itemsState, props);
        return [
            itemsState,
            selectedKeysState,
            getInitCaption(selectedKeysState, itemsState, props),
        ];
    }, [
        props.dateMenuItems,
        props.items,
        props.viewMode,
        props.extendedCaption,
        props.propertyValue,
        props.resetValue,
        props.textValue,
    ]);

    const periodChangedCallback = React.useCallback(
        (startValue: Date, endValue: Date) => {
            if (startValue || endValue) {
                const isSingle = props.selectionType === 'single';
                const valueRange = [startValue, endValue];
                getTextValue(props, items, [BY_PERIOD_KEY], valueRange).then((textValue) => {
                    propertyValueChanged(
                        props.onPropertyValueChanged,
                        isSingle ? startValue : valueRange,
                        textValue
                    );
                });
            }
        },
        [props.selectionType]
    );

    const selectedItemCallback = React.useCallback(
        (item: Model) => {
            const key = item.getKey();
            propertyValueChanged(
                props.onPropertyValueChanged,
                key,
                item.get(props.displayProperty)
            );
        },
        [props.selectionType, props.displayProperty]
    );

    const targetRef = React.useRef();
    const setRefs = React.useCallback((element) => {
        targetRef.current = element;
        if (ref) {
            ref(element);
        }
    }, []);

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
            propertyValue: props.propertyValue,
            editorMode: props.editorMode,
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
        selectedKeys,
    ]);

    const onItemClickHandler = React.useCallback(
        (item) => {
            onItemClick(item, {
                ...datePopupProps,
                openerControl: targetRef,
                targetContainer: targetRef,
                selectedItemCallback,
                periodChangedCallback,
            });
        },
        [datePopupProps, props.propertyValue, props.editorMode]
    );

    const templateOptions = React.useMemo(() => {
        return {
            viewMode: props.viewMode,
            filterViewMode: props.filterViewMode,
            filterIndex: props.filterIndex,
            fontColorStyle: props.fontColorStyle,
            fontSize: props.fontSize,
            keyProperty: props.keyProperty,
            displayProperty: props.displayProperty,
            extendedCaption: props.extendedCaption,
            itemTemplate: props.itemTemplate,
            onItemClick: onItemClickHandler,
            caption,
            items,
            selectedKeys,
        };
    }, [
        props.viewMode,
        props.filterViewMode,
        props.filterIndex,
        props.fontColorStyle,
        props.fontSize,
        props.keyProperty,
        props.displayProperty,
        caption,
        items,
        selectedKeys,
        onItemClickHandler,
    ]);

    return (
        <BaseEditor
            ref={setRefs}
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
};

export default DateMenu;
