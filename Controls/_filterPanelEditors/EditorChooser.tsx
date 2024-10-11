/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import * as React from 'react';
import { TEditorsViewMode, ListEditor } from 'Controls/filterPanel';

interface IEditorChooserOptions {
    editorsViewMode: TEditorsViewMode;
    children?: React.ReactNode;
}

/**
 * Компонент-обертка для редакторов выбора из справочника.
 * @class Controls/_filterPanelEditors/EditorChooser
 * @private
 */
export default React.forwardRef(function EditorChooser(
    props: IEditorChooserOptions,
    ref: React.ForwardedRef<unknown>
): React.ReactElement {
    if (
        props.editorsViewMode === 'cloud' ||
        (props.editorsViewMode !== 'default' && props.viewMode === 'extended')
    ) {
        return props.children;
    } else {
        return <ListEditor forwardedRef={ref} {...props} />;
    }
});
