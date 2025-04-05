/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { forwardRef, ReactElement, ForwardedRef, useCallback, useMemo } from 'react';
import { BaseEditor, IEditorOptions } from 'Controls/filterPanel';
import { IComponentProps, IFontSizeOptions } from 'Controls/interface';
import 'css!Controls/filterPanelEditors';

export interface ITextEditorOptions
    extends IEditorOptions<boolean>,
        IComponentProps,
        IFontSizeOptions {
    filterValue: unknown;
}

/**
 * Контрол используют в качестве редактора для выбора логического параметра.
 *
 * @remark
 * Полезные ссылки:
 *
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-panel/ руководство разработчика по настройке Controls-ListEnv/filterPanelConnected:View}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-view/base/ руководство разработчика по настройке Controls-ListEnv/filterConnected:View}
 *
 * @class Controls/_filterPanelEditors/Text
 * @demo Controls-ListEnv-demo/FilterPanel/View/Editors/TextEditor/Index
 * @demo Controls-ListEnv-demo/Filter/View/Editors/BooleanEditor/Index
 * @public
 */

function EditorTemplate(props: ITextEditorOptions): ReactElement {
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

export default forwardRef(function TextEditor(
    props: ITextEditorOptions,
    ref: ForwardedRef<unknown>
): ReactElement {
    const { extendedCaption, filterViewMode, fontSize } = props;
    const onPropertyValueChange = useCallback(
        (event) =>
            props.onPropertyValueChanged?.(event, {
                value: props.filterValue !== undefined ? props.filterValue : !props.resetValue,
                textValue: extendedCaption,
            }),
        [props.filterValue, extendedCaption]
    );

    const editorTemplateOptions = useMemo(() => {
        return {
            extendedCaption,
            filterViewMode,
            fontSize,
        };
    }, [extendedCaption, filterViewMode, fontSize]);

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
