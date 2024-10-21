import { Button } from 'Controls/buttons';
import * as React from 'react';
import { DataContext } from 'Controls-DataEnv/context';
import * as rk from 'i18n!Controls-Lists-editors';
import {
    calculateSelectionState,
    countSelectedColumns,
    createTree,
} from 'Controls-Lists-editors/_columnsEditor/utils/markup';

/**
 * Интерфейс компонента заголовка
 */
interface IHeaderContentTemplateProps {
    /**
     * Обработчик сохранения настроек
     */
    save: Function;
}

/**
 * Шаблон заголовка окна "Редактора колонок"
 * @param {IHeaderContentTemplateProps} props Пропсы компонента
 * @category component
 * @private
 */
export function HeaderContentTemplate(props: IHeaderContentTemplateProps) {
    const editorContext = React.useContext(DataContext)?.SiteEditorSlice;
    const actualData = editorContext
        ?.getFrame('mainFrame')
        ?.frameFacade.getContent()[0]
        .getStaticProperties();
    const columns = actualData.editingColumns;
    const header = actualData.editingHeaders;
    const selectedColumnsIdxs = actualData.selectedColumnsIdxs;
    const selectedColumnsCount = React.useMemo(() => {
        const selectionState = calculateSelectionState(header, selectedColumnsIdxs);
        const tree = createTree(header, selectionState, columns);
        return countSelectedColumns(tree);
    }, [columns, header, selectedColumnsIdxs]);
    return (
        <div className="ws-flexbox ws-flex-end">
            {selectedColumnsCount && selectedColumnsCount > 0 ? (
                <span
                    className={'ControlsListsEditors_columnsListPopup-header_text'}
                    data-qa={'Controls-Lists-editors_columnsEditor_MainPopup__selectedColumnsCount'}
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
                    onClick={props.save}
                />
            ) : null}
        </div>
    );
}
