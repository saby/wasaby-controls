import * as React from 'react';
import { Lookup, ILookupEditorOptions } from 'Controls/filterPanelEditors';
import { IExtendedPropertyValue } from 'Controls/filterPanel';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { isEqual } from 'Types/object';
import { withWasabyEventObject } from 'UI/Events';

export interface ITagEditorProps
    extends Omit<ILookupEditorOptions, 'propertyValue' | 'onPropertyValueChanged'> {
    propertyValue?: string | null;
    /**
     * @name Controls-ListEnv/_filterPanelExtEditors:Tag#cloudBackgroundStyleProperty
     * @cfg {String} Поле записи, содержащее стиль фона для облачка.
     */
    cloudBackgroundStyleProperty?: string;
    onPropertyValueChanged?: Function;
    onClick?: Function;
}

/**
 * Редактор выбора тега из списка тегов.
 * В основе редактора используется {@link Controls/filterPanelEditors:Lookup}
 * @extends Controls/lookup:Selector
 * @mixes Controls/_filterPanelEditors/Lookup/interface/ILookupEditor
 * @demo Controls-ListEnv-demo/FilterSearch/View/Background/Index
 * @public
 */
export default React.forwardRef(function TagEditor(props: ITagEditorProps, ref) {
    const onItemsChanged = React.useCallback(
        (selectedItems?: RecordSet) => {
            const selectedItem = selectedItems?.at(0);
            const value = {
                value: selectedItem || props.resetValue,
                textValue: selectedItem?.get(props.displayProperty) || '',
                viewMode:
                    (!selectedItem || isEqual(selectedItem, props.resetValue)) &&
                    props.extendedCaption
                        ? 'extended'
                        : 'basic',
            };
            props.onPropertyValueChanged?.(value);
        },
        [
            props.displayProperty,
            props.keyProperty,
            props.resetValue,
            props.extendedCaption,
            props.onPropertyValueChanged,
        ]
    );

    const onPropertyValueChanged = React.useCallback(
        withWasabyEventObject((event: Event, propertyValue: IExtendedPropertyValue) => {
            event.stopPropagation();
            if (isEqual(propertyValue.value, props.resetValue)) {
                props.onPropertyValueChanged?.(propertyValue);
            }
        }),
        [props.onPropertyValueChanged, props.resetValue]
    );

    const propertyValue = React.useMemo(() => {
        return props.propertyValue instanceof Model
            ? props.propertyValue.getKey()
            : props.propertyValue;
    }, [props.propertyValue]);

    const backgroundStyle = React.useMemo(() => {
        const backgroundProperty = props.cloudBackgroundStyleProperty;
        const value = props.propertyValue;
        return value instanceof Model && backgroundProperty
            ? value.get(backgroundProperty) || 'filterPopupStyle'
            : '';
    }, [props.propertyValue, props.cloudBackgroundStyleProperty]);

    return (
        <Lookup
            ref={ref}
            {...props}
            propertyValue={propertyValue}
            multiSelect={false}
            cloudBackgroundStyle={backgroundStyle}
            onItemsChanged={onItemsChanged}
            onPropertyValueChanged={onPropertyValueChanged}
        />
    );
});
