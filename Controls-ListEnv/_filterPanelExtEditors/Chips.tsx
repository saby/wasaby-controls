/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import * as React from 'react';
import { BaseEditor, IEditorOptions } from 'Controls/filterPanel';
import { Control } from 'Controls/Chips';
import { RecordSet } from 'Types/collection';
import 'css!Controls-ListEnv/filterPanelExtEditors';

export interface IChipsEditorOptions extends IEditorOptions<boolean> {
    value: string[] | number[];
    items: RecordSet;
    displayProperty?: string;
}

/**
 * Контрол используют в качестве редактора для перечисляемого типа в виде чипс.
 * @class Controls-ListEnv/_filterPanelExtEditors/Chips
 * @extends UI/Base:Control
 * @mixes Controls/Chips:Control
 * @demo Controls-ListEnv-demo/Filter/View/Editors/ChipsEditor/Index
 * @public
 */

function EditorTemplate(props: IChipsEditorOptions): React.ReactElement {
    return (
        <Control
            attrs={props.attrs}
            keyProperty={props.keyProperty}
            displayProperty={props.displayProperty}
            fontSize={props.fontSize}
            itemTemplate={props.itemTemplate}
            contrastBackground={props.contrastBackground}
            inlineHeight={props.inlineHeight}
            direction={props.direction}
            multiline={props.multiline}
            allowEmptySelection={props.allowEmptySelection}
            viewMode={props.viewMode}
            items={props.items}
            selectedKeys={props.propertyValue}
            onSelectedKeysChanged={props.onSelectedKeysChanged}
            className={'controls-FilterViewPanel__chipsEditor'}
        ></Control>
    );
}

function getTextValue(
    itemIds: string[] | number[],
    { items, displayProperty }: Partial<IChipsEditorOptions>
): string {
    const textArray = [];
    itemIds.forEach((id) => {
        const item = items.getRecordById(id);
        textArray.push(item.get(displayProperty || 'title'));
    });
    return textArray.join(', ');
}

export default React.forwardRef(function ChipsEditor(
    props: IChipsEditorOptions,
    ref: React.ForwardedRef<unknown>
): React.ReactElement {
    const onPropertyValueChange = React.useCallback(
        (event, newValue) => {
            const value = {
                value: newValue,
                textValue: getTextValue(newValue, {
                    items: props.items,
                    displayProperty: props.displayProperty,
                }),
                viewMode: 'basic',
            };

            props.onPropertyValueChanged?.(event, value);
        },
        [props.onPropertyValueChanged, props.displayProperty, props.items]
    );

    const editorTemplateOptions = {
        onSelectedKeysChanged: onPropertyValueChange,
    };

    const onExtendedCaptionClick = React.useCallback(
        (event) => {
            onPropertyValueChange(event, props.propertyValue);
        },
        [props.propertyValue]
    );

    return (
        <BaseEditor
            ref={ref}
            attrs={props.attrs}
            viewMode={props.viewMode}
            onPropertyValueChanged={props.onPropertyValueChanged}
            propertyValue={props.propertyValue}
            resetValue={props.resetValue}
            extendedCaption={props.extendedCaption}
            onExtendedCaptionClick={onExtendedCaptionClick}
            editorTemplate={EditorTemplate}
            editorTemplateOptions={{
                ...props,
                ...editorTemplateOptions,
            }}
        />
    );
});
