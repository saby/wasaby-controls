import * as React from 'react';
import Async from 'Controls/Container/Async';
import SelectionContainer from 'Controls/_filterPanelEditors/SelectionContainer';
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

export default React.memo(
    React.forwardRef((props: IDropdownOptions, ref) => {
        const textValueRef = React.useRef(props.textValue);

        const hasHistory = React.useMemo(() => {
            return (
                props.historyId ||
                cInstance.instanceOfModule(props.source, 'Controls/history:Source')
            );
        }, [props.historyId, props.source]);

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

        const dropdown = useContent(
            (contentProps) => {
                let buildByItems = props.buildByItems;
                if (props.items && contentProps.selectedKeys) {
                    buildByItems = contentProps.selectedKeys.every((key) => {
                        return props.items.getRecordById(key);
                    });
                }

                return (
                    <Async
                        templateName="Controls/dropdown:Selector"
                        templateOptions={{
                            ...props,
                            ...contentProps,
                            emptyText: props.emptyText,
                            fontColorStyle: props.fontColorStyle || 'default',
                            style: 'filterPanel',
                            caption: props.extendedCaption,
                            maxVisibleItems: 20,
                            underline: 'none',
                            sourceController: hasHistory ? null : props.sourceController,
                            items: hasHistory && !buildByItems ? null : props.items,
                            buildByItems,
                            dataLoadCallback,
                            onTextValueChanged: textValueChangedCallback,
                        }}
                        {...contentProps}
                        className="controls-FilterViewPanel__dropdownEditor"
                    />
                );
            },
            // https://online.sbis.ru/opendoc.html?guid=a34c30d7-4a3f-44e4-9f5e-14e72f557bba&client=3
            [props.task1189343904 && props.filter, props.source]
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
                    content={dropdown}
                ></SelectionContainer>
            </div>
        );
    })
);
