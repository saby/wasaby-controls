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
            {...props}
            selectedKeys={props.propertyValue}
            onSelectedkeyschanged={props.valueChangedHandler}
            className={'controls-FilterViewPanel__chipsEditor'}
        ></Control>
    );
}

export default React.forwardRef(function ChipsEditor(
    props: IChipsEditorOptions,
    ref: React.ForwardedRef<unknown>
): React.ReactElement {
    const getTextValue = (itemIds: string[] | number[]) => {
        const textArray = [];
        itemIds.forEach((id) => {
            const item = props.items.getRecordById(id);
            textArray.push(item.get(props.displayProperty || 'title'));
        });
        return textArray.join(', ');
    };

    const onPropertyValueChange = React.useCallback(
        (event, newValue) => {
            const value = {
                value: newValue,
                textValue: getTextValue(newValue),
                viewMode: 'basic',
            };

            props.onPropertyvaluechanged?.(event, value);
        },
        [props.propertyValue]
    );

    const editorTemplateOptions = {
        extendedCaption: props.extendedCaption,
        valueChangedHandler: onPropertyValueChange,
    };

    return (
        <BaseEditor
            ref={ref}
            {...props}
            onExtendedCaptionClick={(event) => {
                onPropertyValueChange(event, props.propertyValue);
            }}
            editorTemplate={EditorTemplate}
            editorTemplateOptions={{
                ...props,
                ...editorTemplateOptions,
            }}
        />
    );
});
