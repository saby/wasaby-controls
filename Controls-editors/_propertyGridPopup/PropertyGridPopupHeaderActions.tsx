import { Button as ButtonControl } from 'Controls/buttons';
import * as rk from 'i18n!Controls';
import { ObjectMeta, ObjectMetaAttributes } from 'Meta/types';
import { useCallback } from 'react';
import PropertyGridPopupHeaderTitle from './PropertyGridPopupHeaderTitle';

interface IPropertyGridPopupHeaderActionsProps<RuntimeInterface extends object> {
    onReset: () => void;
    value: RuntimeInterface;
    metaType: ObjectMeta<RuntimeInterface>;
    title?: string;
    headerEditorMeta: ObjectMeta<object> | undefined;
    onChange: (val: Partial<RuntimeInterface>) => void;
    attrsWithoutDefaults: ObjectMetaAttributes<object>;
}

function PropertyGridPopupHeaderActions<RuntimeInterface extends object>({
    onReset,
    value,
    metaType,
    title,
    headerEditorMeta,
    onChange,
    attrsWithoutDefaults,
}: IPropertyGridPopupHeaderActionsProps<RuntimeInterface>) {
    const isResetReadonly = useCallback(() => {
        return Object.keys(value).every((k) => k in attrsWithoutDefaults);
    }, [value, metaType, headerEditorMeta, attrsWithoutDefaults]);

    return (
        <>
            <PropertyGridPopupHeaderTitle
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

export default PropertyGridPopupHeaderActions;
