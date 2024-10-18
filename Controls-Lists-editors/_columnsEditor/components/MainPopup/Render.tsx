import { Stack } from 'Controls/popupTemplate';
import { BodyContentTemplate } from 'Controls-Lists-editors/_columnsEditor/components/MainPopup/BodyContentTemplate';
import * as React from 'react';
import {
    HeaderContentTemplate,
    IColumnsEditorValue,
} from 'Controls-Lists-editors/_columnsEditor/components/MainPopup/HeaderContentTemplate';
import { Container as ToolbarContainer } from 'Controls-ListEnv/toolbarConnected';
import { toolbarFactory } from 'SiteEditorBase/toolbarFactory';
import { addNewFolderAction } from 'Controls-Lists-editors/_columnsEditor/actions/AddNewFolder';
import { deleteSelectedColumnsAction } from 'Controls-Lists-editors/_columnsEditor/actions/DeleteSelectedColumns';
import { ForwardedRef, forwardRef } from 'react';
import { View } from 'Controls/toolbars';
import { DataContext } from 'Controls-DataEnv/context';
import { Context as PopupContext } from 'Controls/popup';
import rk = require('i18n!Controls-Lists-editors');
import { validateEditedColumns } from 'Controls-Lists-editors/_columnsEditor/utils/data';
import { ControllerBase as FormController } from 'Controls/form';
import { Model } from 'Types/entity';
import { FRAME_ID } from 'Controls-Lists-editors/_columnsEditor/constants';

const verticalView = forwardRef((props: object, ref: ForwardedRef<HTMLDivElement>): JSX.Element => {
    return (
        <View
            {...props}
            forwardedRef={ref}
            direction="vertical"
            className={'ControlsListsEditors-rightToolbar_margin-top'}
        />
    );
});

export default function Render() {
    const editorContext = React.useContext(DataContext)?.SiteEditorSlice;
    const popupContext = React.useContext(PopupContext);
    const actualData = editorContext
        ?.getFrame(FRAME_ID)
        ?.frameFacade.getContent()[0]
        .getStaticProperties();
    const shouldShowConfirmation = React.useRef(true);
    const sendResult = React.useCallback(() => {
        const result: IColumnsEditorValue = {
            columns: validateEditedColumns(actualData?.editingColumns),
            header: actualData?.editingHeaders,
        };
        popupContext?.sendResult(result);
    }, [actualData, popupContext]);
    const save = React.useCallback(() => {
        sendResult();
        shouldShowConfirmation.current = false;
        popupContext.close();
    }, [popupContext, sendResult]);
    const requestCustomUpdate = React.useCallback(() => {
        save();
        return true;
    }, [save]);
    const record = React.useMemo(() => {
        return new Model({
            rawData: {
                hasChanges: true,
            },
        });
    }, []);
    const confirmationShowingCallback = React.useCallback(() => {
        return editorContext.history.hasUndo() && shouldShowConfirmation.current;
    }, [editorContext]);
    return (
        <div className={'ControlsListsEditors-popup'}>
            <FormController
                record={record}
                confirmationShowingCallback={confirmationShowingCallback}
                onRequestCustomUpdate={requestCustomUpdate}
                customEvents={['onRequestCustomUpdate']}
                className={'tw-h-full'}
            >
                <Stack
                    save={save}
                    headingCaption={rk('Настройка колонок')}
                    headerBackgroundStyle={'default'}
                    headerBorderVisible={false}
                    bodyContentTemplate={BodyContentTemplate}
                    backgroundStyle={'unaccented'}
                    headerContentTemplate={React.createElement(HeaderContentTemplate, {
                        save,
                    })}
                    rightBorderVisible={false}
                    toolbarContentTemplate={React.createElement(ToolbarContainer, {
                        actions: [
                            toolbarFactory.reset({ tooltip: rk('Вернуть настройки по умолчанию') }),
                            toolbarFactory.undo(),
                            toolbarFactory.redo(),
                            addNewFolderAction,
                            deleteSelectedColumnsAction,
                        ],
                        content: verticalView,
                    })}
                />
            </FormController>
        </div>
    );
}
