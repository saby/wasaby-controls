import { Button as ButtonControl } from 'Controls/buttons';
import * as rk from 'i18n!Controls';
import { ObjectMeta } from 'Types/meta';
import { useCallback } from 'react';
import { isEqual } from 'Types/object';
import ObjectEditorPopupHeaderTitle from './ObjectEditorPopupHeaderTitle';

interface IHeaderActionsProps<RuntimeInterface extends object> {
    onReset: () => void;
    value: RuntimeInterface;
    metaType: ObjectMeta<RuntimeInterface>;
    title?: string;
    headerEditorMeta: ObjectMeta<object> | undefined;
    onChange: (val: Partial<RuntimeInterface>) => void;
}

function ObjectEditorPopupHeaderActions<RuntimeInterface extends object>({
    onReset,
    value,
    metaType,
    title,
    headerEditorMeta,
    onChange
}: IHeaderActionsProps<RuntimeInterface>) {
    const isResetReadonly = useCallback(() => {
        const defaultValue = {
            ...metaType.getDefaultValue(),
            ...(headerEditorMeta?.getDefaultValue() || {})
        };
        const attributes = metaType.getAttributes();
        const currentValue = {};
        Object.keys(attributes).forEach((key) => {
            if (key in value && value[key] !== undefined) {
                currentValue[key] = value[key];
            } else if (key in attributes && attributes[key] && attributes[key].getDefaultValue() !== undefined) {
                currentValue[key] = attributes[key].getDefaultValue();
            }
        });
        return isEqual(defaultValue, currentValue);
    }, [value, metaType, headerEditorMeta]);

    return (
        <>
            <ObjectEditorPopupHeaderTitle
                title={title}
                onChange={onChange}
                headerEditorMeta={headerEditorMeta}
                value={value}
            />
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
        </>
    );
}

export default ObjectEditorPopupHeaderActions;
