import { ISiteEditorSlice } from 'FrameEditor/interfaces';
import { onColumnDeleteCallback } from 'Controls-Lists-editors/_columnsEditor/utils/handlers';
import { BaseAction, IActionOptions } from 'Controls/actions';
import { IElementFacade, IFrameFacade, modifyFrameRecursively } from 'Frame/base';
import { FRAME_ID } from 'Controls-Lists-editors/_columnsEditor/constants';
import { Confirmation, IConfirmationOptions } from 'Controls/popup';
import { createToolbarButton } from 'SiteEditorBase/toolbarFactory';

const confirmationPopupOptions: IConfirmationOptions = {
    buttons: [
        {
            caption: 'ОК',
            value: true,
            buttonStyle: 'danger',
        },
    ],
    markerStyle: 'primary',
    style: 'default',
    message: 'Колонки не выбраны',
    details: 'Отметьте колонки, которые необходимо удалить',
};

export const deleteSelectedColumnsAction = createToolbarButton({
    id: 'deleteColumns',
    icon: 'icon-Erase',
    iconStyle: 'danger',
    tooltip: 'Удалить выбранные колонки',
    actionName: 'Controls-Lists-editors/columnsEditor:DeleteSelectedColumns',
});

/**
 * Экшен массового удаления колонок
 */
export class DeleteSelectedColumns extends BaseAction {
    constructor(options: IActionOptions) {
        super(options);
    }

    onExecuteHandler = () => {
        const slice = this.getSiteEditorSlice();
        const actualParams = slice
            ?.getFrame(FRAME_ID)
            .frameFacade.getContent()[0]
            .getStaticProperties();
        const actualColumns = actualParams.editingColumns;
        const actualHeaders = actualParams.editingHeaders;
        const actualSelectedColumnsIdxs: number[] = actualParams.selectedColumnsIdxs;
        if (actualColumns) {
            let newColumns = [...actualColumns];
            let newHeader = [...actualHeaders];
            let selectedColumnsIdxs = [...actualSelectedColumnsIdxs];
            if (selectedColumnsIdxs.length > 0) {
                while (selectedColumnsIdxs.length > 0) {
                    const columnToDeleteId = selectedColumnsIdxs[0];
                    const newConfig = onColumnDeleteCallback(
                        newHeader,
                        newColumns,
                        selectedColumnsIdxs,
                        columnToDeleteId
                    );
                    newColumns = [...newConfig.editingColumns];
                    newHeader = [...newConfig.editingHeaders];
                    selectedColumnsIdxs = [...newConfig.selectedColumnsIdxs];
                }

                const frameFacade: IFrameFacade = slice.getFrame(FRAME_ID).frameFacade;
                const newStaticProperties = {
                    ...frameFacade.getContent()[0].getStaticProperties(),
                    editingColumns: newColumns,
                    editingHeaders: newHeader,
                    selectedColumnsIdxs: [],
                };
                const newFrameFacade: IFrameFacade = modifyFrameRecursively(
                    frameFacade,
                    (element: IElementFacade) => {
                        return element.modify({
                            staticProperties: newStaticProperties,
                        });
                    }
                );
                slice.changeFrame(FRAME_ID, newFrameFacade);
            } else {
                Confirmation.openPopup(confirmationPopupOptions, (opener = null));
            }
        }
    };

    private getSiteEditorSlice(): ISiteEditorSlice | undefined {
        return this._options.context?.SiteEditorSlice as ISiteEditorSlice;
    }
}
