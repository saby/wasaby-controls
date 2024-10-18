import { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Title } from 'Controls/heading';
import { Button } from 'Controls/buttons';
import { Context } from 'Controls/popup';
import { Dialog } from 'Controls/popupTemplate';
import * as rk from 'i18n!Controls-editors';
import { getActionByModel } from './Utils';
import { Model } from 'Types/entity';
import { ActionEditorPopupTemplate } from 'Controls-Input-editors/ActionEditor';
import { isEqual } from 'Types/object';
import { Controller as ValidationController } from 'Controls/validate';
import 'css!Controls-Input-editors/ActionsListEditor/ActionsListEditor';

export const ActionsListEditorPopup = function (props): JSX.Element {
    const popupContext = useContext(Context);
    const popupRef = useRef();
    const validationContainerRef = useRef<ValidationController>(null);
    const [actionConfig, setActionConfig] = useState({ ...props.actionConfig });
    const valueChanged = useMemo(() => !isEqual(props.actionConfig, actionConfig), [actionConfig]);
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

    const onApplyAction = useCallback(async () => {
        if (popupContext) {
            const validateResult = await validationContainerRef.current?.submit();
            if (!validateResult.hasErrors) {
                popupContext.sendResult(actionConfig);
                popupContext.close();
            }
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
            <ValidationController ref={validationContainerRef}>
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
                                readOnly={!valueChanged}
                            />
                        </div>
                    }
                    bodyContentTemplate={
                        <ActionEditorPopupTemplate
                            backgroundColor="default"
                            ref={popupRef}
                            editingObject={editingObject}
                            typeDescription={typeDescription}
                            closeButtonVisibility="hidden"
                            actionConfig={actionConfig}
                            editingObjectChangedHandler={editingObjectChangedHandler}
                            actionChangedHandler={onActionTypeChanged}
                        />
                    }
                />
            </ValidationController>
        );
    }
    return null;
};
