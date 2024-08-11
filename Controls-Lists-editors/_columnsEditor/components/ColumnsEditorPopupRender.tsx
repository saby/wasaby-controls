import { TransparentDataContextProvider } from 'Frame/player';
import { Stack } from 'Controls/popupTemplate';
import { BodyContentTemplate } from './BodyContentTemplate';
import { IColumnsEditorRenderProps } from '../interface';
import { HeaderContentTemplate } from './HeaderContentTemplate';
import * as React from 'react';
import { ForwardedRef, forwardRef } from 'react';
import { View } from 'Controls/toolbars';
import { Container as ToolbarContainer } from 'Controls-ListEnv/toolbarConnected';
import { toolbarFactory } from 'SiteEditorBase/toolbarFactory';
import { deleteSelectedColumnsAction } from 'Controls-Lists-editors/_columnsEditor/actions/DeleteSelectedColumns';
import { addNewFolderAction } from 'Controls-Lists-editors/_columnsEditor/actions/AddNewFolder';
import rk = require('i18n!Controls-Lists-editors');

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

/**
 * Компонент - шаблон окна диалога редактора колонок
 * @param props {IColumnsEditorRenderProps}
 */
function ColumnsEditorPopupRender(props: IColumnsEditorRenderProps) {
    return (
        <TransparentDataContextProvider
            contextConfig={props.contextConfig}
            contextData={props.contextData}
        >
            <div className={'ControlsListsEditors-popup'}>
                <Stack
                    headingCaption={rk('Настройка колонок')}
                    headerBackgroundStyle={'default'}
                    closeButtonVisible={false}
                    headerBorderVisible={false}
                    bodyContentTemplate={BodyContentTemplate}
                    backgroundStyle={'unaccented'}
                    headerContentTemplate={React.createElement(HeaderContentTemplate, {
                        onClose: props.onClose,
                    })}
                    rightBorderVisible={false}
                    toolbarContentTemplate={React.createElement(ToolbarContainer, {
                        actions: [
                            toolbarFactory.reset({ tooltip: 'Вернуть настройки по умолчанию' }),
                            toolbarFactory.undo(),
                            toolbarFactory.redo(),
                            addNewFolderAction,
                            deleteSelectedColumnsAction,
                        ],
                        content: verticalView,
                    })}
                    onClose={() => {
                        props.onClose();
                    }}
                />
            </div>
        </TransparentDataContextProvider>
    );
}

ColumnsEditorPopupRender.isReact = true;
export default ColumnsEditorPopupRender;
