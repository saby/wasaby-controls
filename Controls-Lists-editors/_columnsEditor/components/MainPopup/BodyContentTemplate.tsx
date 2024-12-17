import { FramePlayerEditor } from 'FrameEditor/player';
import * as React from 'react';
import { DataContext } from 'Controls-DataEnv/context';
import { ColumnsEditorPopupContext } from 'Controls-Lists-editors/_columnsEditor/context/ColumnsEditorPopupContext';

/**
 * Шаблон контента окна "Редактора колонок"
 * @category component
 * @private
 */
export function BodyContentTemplate() {
    const context = React.useContext(DataContext);
    const siteEditorSlice = context.SiteEditorSlice;
    const listWidgetSlice = context.GridWidgetSlice;
    const actualProps = siteEditorSlice
        .getFrame('mainFrame')
        .frameFacade.getContent()[0]
        .getStaticProperties();
    const actualColumns = actualProps.editingColumns;
    const actualHeader = actualProps.editingHeaders;
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
    }, [actualColumns, actualHeader, listWidgetSlice]);

    const popupRef = React.useRef(null);
    const contextValue = React.useMemo(() => {
        return {
            popupContainer: popupRef,
        };
    }, []);
    return (
        <ColumnsEditorPopupContext.Provider value={contextValue}>
            <div
                className={
                    'ControlsListsEditors-popup_content controls-background-default controls__block-wrapper tr'
                }
                ref={popupRef}
            >
                <div
                    className={
                        'tw-flex tw-flex-col tw-flex-grow tw-justify-start tw-items-center ControlsListsEditors-frame_player_editor-wrapper controls__block controls-background-unaccented'
                    }
                >
                    <div>
                        <FramePlayerEditor />
                    </div>
                </div>
            </div>
        </ColumnsEditorPopupContext.Provider>
    );
}
