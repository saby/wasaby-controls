import { FramePlayerEditor } from 'FrameEditor/player';
import * as React from 'react';
import { DataContext } from 'Controls-DataEnv/context';
import { View } from 'Controls/toolbars';
import { Container as ToolbarContainer } from 'Controls-ListEnv/toolbarConnected';
import { toolbarFactory } from 'SiteEditorBase/toolbarFactory';
import { ForwardedRef, forwardRef } from 'react';
import { ColumnsEditorPopupContext } from 'Controls-Lists-editors/_columnsEditor/context/ColumnsEditorPopupContext';

const verticalView = forwardRef((props: object, ref: ForwardedRef<HTMLDivElement>): JSX.Element => {
    return <View {...props} forwardedRef={ref} direction="vertical" />;
});

export function BodyContentTemplate() {
    const context = React.useContext(DataContext);
    const siteEditorSlice = context.SiteEditorSlice;
    const listWidgetSlice = context.GridWidgetSlice;
    const actualProps = siteEditorSlice
        .getFrame('mainFrame')
        .frameFacade.getContent()[0]
        .getStaticProperties();
    const actualColumns = actualProps.selectedColumns;
    const actualHeader = actualProps.selectedHeaders;
    React.useEffect(() => {
        if (
            listWidgetSlice.state.columns !== actualColumns ||
            listWidgetSlice.state.header !== actualHeader
        ) {
            listWidgetSlice.setState({
                columns: actualColumns,
                header: actualHeader,
            });
        }
    }, [actualColumns, actualHeader]);

    const popupRef = React.useRef(null);
    const contextValue = React.useMemo(() => {
        return {
            popupContainer: popupRef,
        };
    }, []);
    return (
        <ColumnsEditorPopupContext.Provider value={contextValue}>
            <div className={'tw-flex ControlsListsEditors-popup_content'} ref={popupRef}>
                <div
                    className={
                        'tw-flex tw-flex-col tw-flex-grow tw-justify-start tw-items-center ControlsListsEditors-frame_player_editor-wrapper'
                    }
                >
                    <FramePlayerEditor />
                </div>
                <ToolbarContainer
                    actions={[toolbarFactory.undo(), toolbarFactory.redo()]}
                    content={verticalView}
                />
            </div>
        </ColumnsEditorPopupContext.Provider>
    );
}
