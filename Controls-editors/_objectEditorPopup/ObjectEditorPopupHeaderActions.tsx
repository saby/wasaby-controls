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
    staticVal: Record<string, unknown>;
}

function ObjectEditorPopupHeaderActions<RuntimeInterface extends object>({
    onReset,
    value,
    metaType,
    title,
    headerEditorMeta,
    onChange,
    staticVal,
}: IHeaderActionsProps<RuntimeInterface>) {
    const isResetReadonly = useCallback(() => {
        // TODO: staticVal -- временное решение. удалить по задаче: https://online.sbis.ru/opendoc.html?guid=62f12fe1-286a-4ed0-a460-1e26e8e0f5cd&client=3
        const staticValKeys = Object.keys(staticVal);
        return Object.keys(value).filter((k) => !staticValKeys.includes(k)).length === 0;
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
