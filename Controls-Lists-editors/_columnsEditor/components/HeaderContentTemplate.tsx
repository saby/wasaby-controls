import { Button } from 'Controls/buttons';
import * as React from 'react';
import { Confirmation, Context as PopupContext, IConfirmationOptions } from 'Controls/popup';
import { DataContext } from 'Controls-DataEnv/context';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { validateEditedColumns } from 'Controls-Lists-editors/_columnsEditor/utils/data';
import * as rk from 'i18n!Controls-Lists-editors';
import {
    calculateSelectionState,
    countSelectedColumns,
    createTree,
} from 'Controls-Lists-editors/_columnsEditor/utils/markup';

export interface IColumnsEditorValue {
    columns: IColumn[];
    header: IHeaderCell[];
}

interface IHeaderContentTemplateProps {
    onClose: Function;
}

const confirmationPopupOptions: IConfirmationOptions = {
    markerStyle: 'primary',
    style: 'default',
    message: rk('Сохранить изменения?'),
    details: rk('Чтобы продолжить редактирование, нажмите «Отмена»'),
    type: 'yesnocancel',
};

export function HeaderContentTemplate(props: IHeaderContentTemplateProps) {
    const popupContext = React.useContext(PopupContext);
    const editorContext = React.useContext(DataContext)?.SiteEditorSlice;
    const actualData = editorContext
        ?.getFrame('mainFrame')
        ?.frameFacade.getContent()[0]
        .getStaticProperties();
    const columns = actualData.editingColumns;
    const header = actualData.editingHeaders;
    const selectedColumnsIdxs = actualData.selectedColumnsIdxs;
    const selectionState = React.useMemo(() => {
        return calculateSelectionState(header, selectedColumnsIdxs);
    }, [header, selectedColumnsIdxs]);
    const tree = React.useMemo(() => {
        return createTree(header, selectionState, columns);
    }, [header, selectionState, columns]);
    const selectedColumnsCount = React.useMemo(() => {
        return countSelectedColumns(tree);
    }, [tree]);
    const sendResult = React.useCallback(() => {
        const result: IColumnsEditorValue = {
            columns: validateEditedColumns(actualData?.editingColumns),
            header: actualData?.editingHeaders,
        };
        popupContext?.sendResult(result);
    }, [actualData, popupContext]);
    return (
        <div className="ws-flexbox ws-flex-end">
            {selectedColumnsCount && selectedColumnsCount > 0 ? (
                <span
                    className={'ControlsListsEditors_columnsListPopup-header_text'}
                >{`Отмечено колонок: ${selectedColumnsCount}`}</span>
            ) : null}
            {editorContext.history.hasUndo() ? (
                <Button
                    viewMode="filled"
                    buttonStyle="success"
                    iconSize="m"
                    icon="icon-Yes"
                    iconStyle="contrast"
                    tooltip={rk('Применить')}
                    data-qa={'ControlsListsEditors__apply'}
                    onClick={() => {
                        sendResult();
                        props.onClose();
                    }}
                />
            ) : null}
            <Button
                viewMode={'filled'}
                buttonStyle={'pale'}
                inlineHeight={'xl'}
                iconSize={'m'}
                icon={'icon-Close'}
                iconStyle={'label'}
                tooltip={rk('Закрыть')}
                className={'ControlsListsEditors-close_button'}
                data-qa={'controls-stack-Button__close'}
                onClick={async () => {
                    if (editorContext.history.hasUndo()) {
                        const answer: boolean = await Confirmation.openPopup(
                            confirmationPopupOptions,
                            (opener = null)
                        );
                        if (answer !== undefined) {
                            if (answer) {
                                sendResult();
                            }
                            popupContext.close();
                        }
                    } else {
                        popupContext.close();
                    }
                }}
            />
        </div>
    );
}
