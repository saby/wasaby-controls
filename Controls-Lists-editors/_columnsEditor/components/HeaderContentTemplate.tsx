import { Button } from 'Controls/buttons';
import * as React from 'react';
import { Context as PopupContext } from 'Controls/popup';
import { DataContext } from 'Controls-DataEnv/context';
import { IColumn, IHeaderCell } from 'Controls/grid';
import { validateEditedColumns } from 'Controls-Lists-editors/_columnsEditor/utils/data';

export interface IColumnsEditorResult {
    columns: IColumn[];
    header: IHeaderCell[];
}

interface IHeaderContentTemplateProps {
    onClose: Function;
}

export function HeaderContentTemplate(props: IHeaderContentTemplateProps) {
    const popupContext = React.useContext(PopupContext);
    const editorContext = React.useContext(DataContext)?.SiteEditorSlice;
    const actualData = editorContext
        ?.getFrame('mainFrame')
        ?.frameFacade.getContent()[0]
        .getStaticProperties();
    return (
        <div className="ws-flexbox ws-flex-end">
            <Button
                viewMode="filled"
                buttonStyle="success"
                iconSize="m"
                icon="icon-Yes"
                iconStyle="contrast"
                tooltip={'Применить'}
                data-qa={'ControlsListsEditors__apply'}
                onClick={() => {
                    popupContext?.sendResult(
                        new Promise((resolve, reject) => {
                            try {
                                const result: IColumnsEditorResult = {
                                    columns: validateEditedColumns(actualData?.selectedColumns),
                                    header: actualData?.selectedHeaders,
                                };
                                resolve(result);
                            } catch (error) {
                                reject(error);
                            }
                        })
                    );
                    props.onClose();
                }}
            />
        </div>
    );
}