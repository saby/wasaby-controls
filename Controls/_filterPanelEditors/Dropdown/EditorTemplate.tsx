import * as React from 'react';
import Async from 'Controls/Container/Async';
import SelectionContainer from 'Controls/_filterPanelEditors/SelectionContainer';
import { initItems } from 'Controls/_filterPanelEditors/Utils/InitItems';
import { useContent } from 'UICore/Jsx';
import * as cInstance from 'Core/core-instance';
import { IDropdownOptions } from './IDropdownEditor';
import { TKey } from 'Controls/interface';
import { SyntheticEvent } from 'Vdom/Vdom';
import { isEqual } from 'Types/object';

function notifySelectedKeysChanged(
    props: IDropdownOptions,
    value: TKey[] | TKey,
    text: string,
    viewMode: string = 'basic'
): void {
    if (!isEqual(value, props.propertyValue)) {
        const extendedValue = {
            value,
            textValue: text,
            viewMode,
        };
        props.onPropertyValueChanged?.(
            new SyntheticEvent(null, {
                type: 'propertyValueChanged',
            }),
            extendedValue
        );
    }
}

function Dropdown(props) {
    let buildByItems = props.buildByItems;
    let selectedItems = props.selectedItems;
    if (props.items && props.selectedKeys) {
        const hasAllSelectedItems = props.selectedKeys.every((key) => {
            return props.items.getRecordById(key);
        });
        buildByItems = hasAllSelectedItems;
        if (!hasAllSelectedItems && props.source) {
            selectedItems = initItems(props, null);
        }
    }

    const dataLoadCallback = React.useCallback(
        (items) => {
            if (props.dataLoadCallback) {
                props.dataLoadCallback(items);
            } else {
                if (
                    items &&
                    !items.getCount() &&
                    props.emptyText &&
                    props.propertyValue !== props.resetValue
                ) {
                    props.handleSelectedKeysChanged(props.emptyKey || props.resetValue);
                }
            }
        },
        [
            props.dataLoadCallback,
            props.emptyText,
            props.propertyValue,
            props.resetValue,
            props.emptyKey,
        ]
    );

    const hasHistory = React.useMemo(() => {
        return (
            props.historyId || cInstance.instanceOfModule(props.source, 'Controls/history:Source')
        );
    }, [props.historyId, props.source]);

    const textValueChangedCallback = React.useCallback((text) => {
        props.textValueChangedCallback(text);
    }, []);

    return (
        <Async
            templateName="Controls/dropdown:Selector"
            templateOptions={{
                ...props,
                emptyText: props.emptyText,
                fontColorStyle: props.fontColorStyle || 'filter',
                style: 'filterPanel',
                caption: props.extendedCaption,
                maxVisibleItems: 20,
                underline: 'none',
                sourceController: hasHistory ? null : props.sourceController,
                items: hasHistory && !buildByItems ? null : props.items,
                buildByItems,
                selectedItems,
                dataLoadCallback,
                onTextValueChanged: textValueChangedCallback,
            }}
            {...props}
            className="controls-FilterViewPanel__dropdownEditor"
        />
    );
}

export default React.memo(
    React.forwardRef((props: IDropdownOptions, ref) => {
        const textValueRef = React.useRef(props.textValue);

        const textValueChangedCallback = React.useCallback((text) => {
            textValueRef.current = text;
        }, []);

        const handleSelectedKeysChanged = React.useCallback(
            (value) => {
                const viewMode =
                    !props.selectedAllText &&
                    props.extendedCaption &&
                    isEqual(value, props.resetValue)
                        ? 'extended'
                        : 'basic';
                notifySelectedKeysChanged(props, value, textValueRef.current, viewMode);
            },
            [
                props.selectedAllText,
                props.extendedCaption,
                props.resetValue,
                props.onPropertyValueChanged,
            ]
        );

        return (
            <div
                className={`ws-ellipsis controls-FilterViewPanel__basicEditor-cloud
                            controls-FilterViewPanel__basicEditor-cloud-${props.filterViewMode}`}
            >
                <SelectionContainer
                    ref={props.forwardedRef}
                    onSelectedKeysChanged={handleSelectedKeysChanged}
                    customEvents={['onSelectedKeysChanged']}
                    multiSelect={props.multiSelect}
                    propertyValue={props.propertyValue}
                    resetValue={props.resetValue}
                    contentProps={{
                        ...props,
                        textValueChangedCallback,
                    }}
                    content={Dropdown}
                />
            </div>
        );
    })
);
