/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import IEditorOptions from 'Controls/_filterPanel/_interface/IEditorOptions';
import * as React from 'react';
import BaseEditor from '../BaseEditor';
import 'css!Controls/filterPanel';

export interface ITextEditorOptions extends IEditorOptions<boolean> {
    filterValue: unknown;
}

/**
 * Контрол используют в качестве редактора для выбора логического параметра на {@link Controls/filterPanel:View панели фильтров}.
 * @class Controls/_filterPanel/Editors/Text
 * @extends UI/Base:Control
 * @demo Controls-ListEnv-demo/FilterPanel/View/Editors/TextEditor/Index
 * @demo Controls-ListEnv-demo/Filter/View/Editors/BooleanEditor/Index
 * @public
 */

function EditorTemplate(props: ITextEditorOptions): React.ReactElement {
    return (
        <div
            data-qa={props.dataQa}
            className={`controls-FilterViewPanel__basicEditor-cloud_without-hover
                             controls-FilterViewPanel__basicEditor-cloud-${props.filterViewMode} controls-fontsize-${props.fontSize}`}
        >
            {props.extendedCaption}
        </div>
    );
}

export default React.forwardRef(function TextEditor(
    props: ITextEditorOptions,
    ref: React.ForwardedRef<unknown>
): React.ReactElement {
    const onPropertyValueChange = React.useCallback(
        (event) => {
            const newValue = props.filterValue !== undefined ? props.filterValue : !props.resetValue;
            const value = {
                value: newValue ,
                textValue: props.extendedCaption,
            };

            props.onPropertyvaluechanged?.(event, value);
        },
        [props.filterValue, props.extendedCaption]
    );

    const editorTemplateOptions = {
        extendedCaption: props.extendedCaption,
        filterViewMode: props.filterViewMode,
        fontSize: props.fontSize,
    };

    return (
        <BaseEditor
            ref={ref}
            {...props}
            onExtendedCaptionClick={onPropertyValueChange}
            editorTemplate={EditorTemplate}
            editorTemplateOptions={editorTemplateOptions}
        />
    );
});

/**
 * @name Controls/_filterPanel/Editors/Text#filterValue
 * @cfg {boolean} Значение, которое передастся в панель фильтров при выборе.
 */
