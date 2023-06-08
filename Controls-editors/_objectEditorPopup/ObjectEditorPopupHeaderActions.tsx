import { Button as ButtonControl } from 'Controls/buttons';
import * as rk from 'i18n!Controls';
import { ObjectMeta } from 'Types/meta';
import { useCallback } from 'react';
import { isEqual } from 'Types/object';

interface IHeaderActionsProps {
    onReset: () => void;
    onApply: () => void;
    value: object;
    metaType: ObjectMeta<object>;
}

function ObjectEditorPopupHeaderActions({
    onApply,
    onReset,
    value,
    metaType,
}: IHeaderActionsProps) {
    const isResetReadonly = useCallback(() => {
        const defaultValue = metaType.getDefaultValue();
        const attributes = metaType.getAttributes();
        const currentValue = {};
        Object.keys(attributes).forEach((key) => {
            if (key in value) {
                currentValue[key] = value[key];
            } else if (key in attributes && attributes[key]) {
                currentValue[key] = attributes[key].getDefaultValue();
            }
        });
        return isEqual(defaultValue, currentValue);
    }, [value, metaType]);

    return (
        <>
            <ButtonControl
                className="controls_objectEditorPopup_WidgetPanelHeader__reset"
                data-qa="controls_objectEditorPopup_WidgetPanelHeader__reset"
                viewMode="link"
                inlineHeight="l"
                iconSize="s"
                icon="icon-Restore"
                tooltip={rk('Сбросить')}
                readOnly={isResetReadonly()}
                iconStyle="label"
                key="ResetButton"
                onClick={onReset}
            />
            <ButtonControl
                className="siteEditorBase_WidgetPanelHeader__apply"
                viewMode="filled"
                buttonStyle="success"
                inlineHeight="l"
                iconSize="m"
                icon="icon-Yes"
                iconStyle="contrast"
                tooltip={rk('Применить')}
                key="SuccessBtn"
                data-qa="siteEditorBase_WidgetPanelHeader__apply"
                onClick={onApply}
            />
        </>
    );
}

export default ObjectEditorPopupHeaderActions;
