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

const verticalView = forwardRef((props: object, ref: ForwardedRef<HTMLDivElement>): JSX.Element => {
    return <View {...props} forwardedRef={ref} direction="vertical" />;
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
                    headingCaption={'Настройка колонок'}
                    headerBackgroundStyle={'default'}
                    closeButtonVisible={true}
                    headerBorderVisible={false}
                    bodyContentTemplate={BodyContentTemplate}
                    backgroundStyle={'unaccented'}
                    headerContentTemplate={React.createElement(HeaderContentTemplate, {
                        onClose: props.onClose,
                    })}
                    rightBorderVisible={false}
                    toolbarContentTemplate={React.createElement(ToolbarContainer, {
                        actions: [
                            toolbarFactory.undo(),
                            toolbarFactory.redo(),
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
