/**
 * Библиотека "Редактор колонок". Контрол, позволяющий настраивать набор колонок в табличных контролах.
 * Подробнее в базе знаний: {@link https://n.sbis.ru/wasaby/knowledge?published=null&mode=readList&folder=f059a166-77da-4310-8bd0-25732a835062}
 * @library
 * @public
 * @demo Controls-Lists-editors-demo/ColumnEditor/WI/Base/Index
 */
export { Opener } from 'Controls-Lists-editors/_columnsEditor/Opener';
export { default as ColumnsEditorPopupRender } from 'Controls-Lists-editors/_columnsEditor/components/ColumnsEditorPopupRender';
export {
    IOpenColumnsEditorProps,
    IColumnsEditorRenderProps,
    IContextConfig,
    IBindings,
} from 'Controls-Lists-editors/_columnsEditor/interface';
export { default as ColumnsDesignTimeEditor } from 'Controls-Lists-editors/_columnsEditor/components/ColumnsDesignTimeEditor';
export { default as ColumnsListPopupRender } from 'Controls-Lists-editors/_columnsEditor/components/ColumnsListPopupRender';
export { ColumnWidthEditor } from 'Controls-Lists-editors/_columnsEditor/components/columnPropsEditors/Width';
export { ColumnValueEditor } from 'Controls-Lists-editors/_columnsEditor/components/columnPropsEditors/Value';
export { ColumnCaptionEditor } from 'Controls-Lists-editors/_columnsEditor/components/columnPropsEditors/Caption';
export { ColumnSeparatorEditor } from 'Controls-Lists-editors/_columnsEditor/components/columnPropsEditors/Separator';
export { IColumnsEditorValue } from 'Controls-Lists-editors/_columnsEditor/components/HeaderContentTemplate';
export { DeleteSelectedColumns } from 'Controls-Lists-editors/_columnsEditor/actions/DeleteSelectedColumns';
export { AddNewFolder } from 'Controls-Lists-editors/_columnsEditor/actions/AddNewFolder';
export { Render as SelectionPopupRender } from 'Controls-Lists-editors/_columnsEditor/components/SelectionPopup/Render/Render';
export { SubTree } from 'Controls-Lists-editors/_columnsEditor/components/columnPropsEditors/SubTree/SubTree';
