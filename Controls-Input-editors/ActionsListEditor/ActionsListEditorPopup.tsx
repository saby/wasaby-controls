import { useCallback, useContext, useMemo, useState } from 'react';
import { Title } from 'Controls/heading';
import { Button } from 'Controls/buttons';
import { Context } from 'Controls/popup';
import { Dialog } from 'Controls/popupTemplate';
import * as rk from 'i18n!Controls-editors';
import { getActionByModel } from './Utils';
import { Model } from 'Types/entity';
import { ActionEditorPopupTemplate } from 'Controls-Input-editors/ActionEditor';
import 'css!Controls-Input-editors/ActionsListEditor/ActionsListEditor';

export const ActionsListEditorPopup = function (props): JSX.Element {
    const popupContext = useContext(Context);
    const [actionConfig, setActionConfig] = useState({ ...props.actionConfig });
    const { typeDescription, editingObject } = useMemo(() => {
        const propTypes = actionConfig?.propTypes || [];
        const additionalDescription = [
            {
                name: 'title',
                type: 'string',
                caption: rk('Название'),
            },
            {
                name: 'icon',
                type: 'string',
                editorTemplateName: 'Controls-Input-editors/ActionsListEditor:IconEditor',
                caption: rk('Иконка'),
            },
        ];
        return {
            typeDescription: [...additionalDescription, ...propTypes],
            editingObject: actionConfig?.actionProps || actionConfig?.commandOptions || {},
        };
    }, [actionConfig]);
    const editingObjectChangedHandler = useCallback(
        (newEditingObject) => {
            setActionConfig({
                ...actionConfig,
                actionProps: newEditingObject,
            });
        },
        [actionConfig]
    );

    const onApplyAction = useCallback(() => {
        if (popupContext) {
            popupContext.sendResult(actionConfig);
            popupContext.close();
        }
    }, [popupContext, actionConfig]);

    const onActionTypeChanged = useCallback(
        (item: Model) => {
            const newAction = getActionByModel(item);
            setActionConfig({
                ...actionConfig,
                type: newAction.type,
                commandName: newAction.commandName,
                propTypes: newAction.propTypes,
                actionProps: newAction.info,
                info: newAction.info,
            });
        },
        [actionConfig]
    );

    const onResetActionChanges = useCallback(() => {
        setActionConfig(props.actionConfig);
    }, [props.actionConfig]);

    if (typeDescription) {
        return (
            <Dialog
                closeButtonVisible={true}
                headerBackgroundStyle="contrast"
                onClose={onApplyAction}
                headerContentTemplate={
                    <div className="controls-Action__header-wrapper ws-flexbox">
                        <Title
                            className="controls-Action__header-caption controls-margin_right-m controls-margin_left-m"
                            caption={rk('Действие')}
                            fontColorStyle="default"
                            fontSize="3xl"
                            fontWeight="bold"
                        />
                        <Button
                            viewMode="link"
                            icon="icon-Restore"
                            iconSize="s"
                            onClick={onResetActionChanges}
                        />
                    </div>
                }
                bodyContentTemplate={
                    <ActionEditorPopupTemplate
                        backgroundColor="default"
                        ref={props.parentRef}
                        editingObject={editingObject}
                        typeDescription={typeDescription}
                        closeButtonVisibility="hidden"
                        actionConfig={actionConfig}
                        editingObjectChangedHandler={editingObjectChangedHandler}
                        actionChangedHandler={onActionTypeChanged}
                    />
                }
            />
        );
    }
    return null;
};
