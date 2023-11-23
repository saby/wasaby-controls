/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import * as React from 'react';
import _List from './_List';
import { TEditorsViewMode } from '../View/ViewModel';

interface IEditorChooserOptions {
    editorsViewMode: TEditorsViewMode;
    children?: React.ReactNode;
}

/**
 * Компонент-обертка для редакторов выбора из справочника.
 * @class Controls/_filterPanel/Editors/EditorChooser
 * @private
 */
export default React.forwardRef(function LookupEditor(
    props: IEditorChooserOptions,
    ref: React.ForwardedRef<unknown>
): React.ReactElement {
    if (
        props.editorsViewMode === 'cloud' ||
        (props.editorsViewMode !== 'default' && props.viewMode === 'extended')
    ) {
        return props.children;
    } else {
        return <_List forwardedRef={ref} {...props} />;
    }
});
