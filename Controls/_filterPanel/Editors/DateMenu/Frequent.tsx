/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import * as React from 'react';
import { SyntheticEvent } from 'Vdom/Vdom';
import Async from 'Controls/Container/Async';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { RecordSet } from 'Types/collection';
import 'css!Controls/filterPanel';
import { Memory } from 'Types/source';
import getItemsWithDateRange from './GetItemsWithDateRange';
import getSelectedKeysByValue from './GetSelectedKeysByValue';
import { onItemClick } from './ItemClickHandler';

const POPUP_CLASS_NAME = 'controls-DateMenuEditor-frequent-popup_shift';

interface IDateEditorFrequentOptions {
    resetValue?: string[] | Date[];
    selectedKeys: string[] | Date[];
    items?: RecordSet;
    captionFormatter?: Function;
    displayProperty: string;
    keyProperty: string;
    viewMode?: string;
}

function itemClickCallback(
    props: IDateEditorFrequentOptions,
    value: Date[],
    textValue: string
): void {
    (props.onItemClick || props.onItemclick)?.(
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
    selectedItemCallback: Function,
    periodChangedCallback: Function
): void {
    onItemClick(item, {
        ...props,
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
 * @extends UI/Base:Control
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
            });
        };

        const getSource = (sourceItems: RecordSet) => {
            return new Memory({
                data: sourceItems.getRawData(),
                keyProperty: props.keyProperty,
            });
        };

        const [items, setItems] = React.useState<RecordSet>(getItemsWithDateRange(props));
        const [selectedKeys, setSelectedKeys] = React.useState<string[]>(getSelectedKeys(items));
        const [source, setSource] = React.useState<Memory>(getSource(items));

        React.useEffect(() => {
            setItems(getItemsWithDateRange(props));
            setSelectedKeys(getSelectedKeys(items));
            setSource(getSource(items));
        }, [props.items]);

        const targetRef = React.createRef();
        const setRefs = (element) => {
            targetRef.current = element;
            if (ref) {
                ref(element);
            }
        };

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

        return (
            <Async
                onItemClick={(item) => {
                    itemClickHandler(
                        item,
                        props,
                        targetRef,
                        selectedItemCallback,
                        periodChangedCallback
                    );
                }}
                customEvents={['onItemClick']}
                templateName="Controls/menu:Control"
                templateOptions={{
                    ...props,
                    selectedKeys,
                    markerVisibility: 'onactivated',
                    source,
                    ref: setRefs,
                }}
            />
        );
    }
);

DateEditorFrequent.defaultProps = {
    displayProperty: 'title',
    keyProperty: 'id',
};

export default DateEditorFrequent;
