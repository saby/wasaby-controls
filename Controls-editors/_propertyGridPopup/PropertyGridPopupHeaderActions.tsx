import { ObjectMeta, ObjectMetaAttributes } from 'Meta/types';
import PropertyGridPopupHeaderTitle from './PropertyGridPopupHeaderTitle';
import { ResetButton } from './ResetButton';

interface IPropertyGridPopupHeaderActionsProps<RuntimeInterface extends object> {
    onReset: (newValue: object) => void;
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
}: IPropertyGridPopupHeaderActionsProps<RuntimeInterface>) {
    return (
        <>
            <PropertyGridPopupHeaderTitle
                title={title}
                onChange={onChange}
                headerEditorMeta={headerEditorMeta}
                value={value}
            />
            <ResetButton
                onReset={onReset}
                widgetProps={value}
                widgetMetaType={metaType}
                className="controls_objectEditorPopup_WidgetPanelHeader__reset"
                dataQa="controls_objectEditorPopup_WidgetPanelHeader__reset"
            />
        </>
    );
}

export default PropertyGridPopupHeaderActions;
