import { createToolbarButton } from 'SiteEditorBase/toolbarFactory';
import rk = require('i18n!Controls-Lists-editors');

export const addNewFolderAction = createToolbarButton({
    id: 'addNewFolder',
    icon: 'icon-CreateFolder',
    iconStyle: 'default',
    tooltip: rk('Добавить папку'),
    actionName: 'Controls-Lists-editors/columnsEditor:AddNewFolder',
    order: -2,
});

export const deleteSelectedColumnsAction = createToolbarButton({
    id: 'deleteColumns',
    icon: 'icon-Erase',
    iconStyle: 'danger',
    tooltip: rk('Удалить выбранные колонки'),
    actionName: 'Controls-Lists-editors/columnsEditor:DeleteSelectedColumns',
    order: -1,
});
