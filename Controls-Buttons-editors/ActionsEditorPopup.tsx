import { memo, useState, useRef } from 'react';
import * as rk from 'i18n!Controls';
import { Stack } from 'Controls/popupTemplate';
import { Container } from 'Controls/scroll';

import { DataContext } from 'Controls-DataEnv/context';
import type { Slice } from 'Controls-DataEnv/slice';
import { IActionOptions } from 'Controls-Buttons/interface';
import { ActionPropsEditor } from './ActionEditorPopup/ActionPropsEditor';
import { ActionList } from './ActionEditorPopup/ActionList';
import { Button } from 'Controls/buttons';
import 'css!Controls-Buttons-editors/ActionEditorPopup/ActionsEditorPopup';

const ACTIONS_SLICE_NAME = 'Actions';

interface IActionsConfigPopupProps {
    name?: string;
    onSendResult: Function;
    onClose: Function;
    dataContext: Record<string, Slice<unknown>>;
    value: IActionOptions;
}

const actionsEditorPopup = memo((props: IActionsConfigPopupProps) => {
    const { value, dataContext, name = ACTIONS_SLICE_NAME } = props;

    const [action, setAction] = useState<IActionOptions>(value);
    const actionRef = useRef(action);

    return (
        <Stack
            closeButtonVisibility={true}
            closeButtonViewMode="toolButton"
            headerBorderVisible={false}
            rightBorderVisible={false}
            backgroundStyle="unaccented"
            headingCaption={rk('Действие')}
            headerContentTemplate={
                <div className="ws-flexbox ws-flex-end">
                    <Button
                        viewMode="filled"
                        buttonStyle="success"
                        inlineHeight="l"
                        iconSize="m"
                        icon="icon-Yes"
                        iconStyle="contrast"
                        tooltip={rk('Применить')}
                        data-qa="siteEditorBase_WidgetPanelHeader__apply"
                        onClick={() => {
                            const result = actionRef.current;
                            if (!!result?.id) {
                                setAction(result);
                                props.onSendResult(result);
                                props.onClose();
                            }
                        }}
                    />
                </div>
            }
            bodyContentTemplate={
                <Container
                    className="controls-margin_right-xs actionsConfig__popupStack-body"
                    content={() => {
                        return (
                            <DataContext.Provider value={dataContext}>
                                <div className="controls__block-wrapper tr without-shadow actionsConfig__popupStack-body">
                                    <div className="controls__block">
                                        {action?.id ? (
                                            <ActionPropsEditor
                                                name={name}
                                                value={actionRef.current}
                                                onChange={(e) => {
                                                    actionRef.current = e;
                                                    if (!e.id) {
                                                        setAction(e);
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <ActionList
                                                name={name}
                                                onActionSelect={(e) => {
                                                    actionRef.current = e;
                                                    setAction(e);
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </DataContext.Provider>
                        );
                    }}
                />
            }
        />
    );
});
actionsEditorPopup.displayName = 'Controls-Buttons-editors/ActionEditorPopup';
actionsEditorPopup.isReact = true;
export default actionsEditorPopup;
