/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import * as React from 'react';
import { BaseEditor, IEditorOptions } from 'Controls/filterPanel';
import 'css!Controls/filterPanelEditors';

export interface ITextEditorOptions extends IEditorOptions<boolean> {
    filterValue: unknown;
}

/**
 * Контрол используют в качестве редактора для выбора логического параметра.
 *
 * @remark
 * Полезные ссылки:
 *
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-panel/ руководство разработчки по настроке Controls-ListEnv/filterPanelConnected:View}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-view/base/ руководство разработчки по настроке Controls-ListEnv/filterConnected:View}
 *
 * @class Controls/_filterPanelEditors/Text
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
            const newValue =
                props.filterValue !== undefined ? props.filterValue : !props.resetValue;
            const value = {
                value: newValue,
                textValue: props.extendedCaption,
            };

            props.onPropertyValueChanged?.(event, value);
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
 * @name Controls/_filterPanelEditors/Text#filterValue
 * @cfg {boolean} Значение, которое передастся в панель фильтров при выборе.
 */
