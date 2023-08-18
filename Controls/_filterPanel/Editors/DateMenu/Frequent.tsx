/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import * as React from 'react';
import { SyntheticEvent } from 'Vdom/Vdom';
import Async from 'Controls/Container/Async';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { RecordSet } from 'Types/collection';
import { Memory } from 'Types/source';
import getMenuItems from './GetMenuItems';
import getSelectedKeysByValue from './GetSelectedKeysByValue';
import { onItemClick } from './ItemClickHandler';
import { IEmptyItemOptions } from 'Controls/dropdown';
import 'css!Controls/filterPanel';

const POPUP_CLASS_NAME = 'controls-DateMenuEditor-frequent-popup_shift';
const customEvents = ['onItemClick'];

interface IDateEditorFrequentOptions extends IEmptyItemOptions {
    resetValue?: string[] | Date[];
    selectedKeys: string[] | Date[];
    items?: RecordSet;
    captionFormatter?: Function;
    displayProperty?: string;
    keyProperty?: string;
    viewMode?: string;
    onItemClick?: Function;
}

function itemClickCallback(
    props: IDateEditorFrequentOptions,
    value: Date[],
    textValue: string
): void {
    props.onItemClick?.(
        new SyntheticEvent(null, {
            type: 'propertyValueChanged',
        }),
        value,
        textValue
    );
}

function periodChanged(props: IDateEditorFrequentOptions, startValue: Date, endValue: Date): void {
    const { Utils } = loadSync('Controls/dateRange');
    const captionFormatter = props.captionFormatter || Utils.formatDateRangeCaption;
    if (startValue || endValue || props.extendedCaption) {
        const textValue = captionFormatter(startValue, endValue, props.extendedCaption);
        if (props.selectionType === 'single') {
            itemClickCallback(props, [startValue], textValue);
        } else {
            itemClickCallback(props, [[startValue, endValue]], textValue);
        }
    }
}

function itemClickHandler(
    item,
    props,
    opener,
    selectedKeys,
    selectedItemCallback: Function,
    periodChangedCallback: Function
): void {
    onItemClick(item, {
        ...props,
        selectedKeys,
        propertyValue: props.selectedKeys,
        popupClassName: POPUP_CLASS_NAME,
        selectedItemCallback,
        periodChangedCallback,
        openerControl: opener.current,
        targetContainer: opener.current,
    });
}

/**
 * Контрол используют в качестве редактора для поля фильтра с типом Date, отображается в виде меню.
 * @class Controls/_filterPanel/Editors/Date
 * @mixes Controls/date:Input
 * @private
 */

const DateEditorFrequent = React.forwardRef(
    (props: IDateEditorFrequentOptions, ref: React.ForwardedRef<unknown>) => {
        const getSelectedKeys = (items: RecordSet) => {
            const selectedKeys =
                props.selectedKeys instanceof Array ? props.selectedKeys[0] : props.selectedKeys;
            const resetValue =
                props.resetValue instanceof Array ? props.resetValue[0] : props.resetValue;
            return getSelectedKeysByValue(items, {
                propertyValue: selectedKeys,
                resetValue,
                emptyText: props.emptyText,
                emptyKey: props.emptyKey,
            });
        };

        const getSource = (sourceItems: RecordSet) => {
            return new Memory({
                data: sourceItems.getRawData(),
                keyProperty: props.keyProperty,
            });
        };

        const items = React.useMemo(() => {
            return getMenuItems(props);
        }, [props.items]);

        const [selectedKeys, source] = React.useMemo(() => {
            return [getSelectedKeys(items), getSource(items)];
        }, [items]);

        const targetRef = React.useRef();

        const selectedItemCallback = React.useCallback(
            (clickedItem) => {
                itemClickCallback(
                    props,
                    [clickedItem.getKey()],
                    clickedItem.get(props.displayProperty)
                );
            },
            [props.displayProperty]
        );
        const periodChangedCallback = React.useCallback((startValue: Date, endValue: Date) => {
            periodChanged(props, startValue, endValue);
        }, []);

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
                keyProperty: props.keyProperty,
            };
        }, [selectedKeys, props.displayProperty, props.keyProperty]);

        const onItemClickHandler = React.useCallback(
            (item) => {
                itemClickHandler(
                    item,
                    props,
                    targetRef,
                    selectedKeys,
                    selectedItemCallback,
                    periodChangedCallback
                );
            },
            [selectedKeys, selectedItemCallback]
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
};

export default DateEditorFrequent;
