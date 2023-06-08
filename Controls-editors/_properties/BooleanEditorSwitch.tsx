import { Fragment, memo, useCallback } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { Switch } from 'Controls/toggle';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';

interface IBooleanEditorSwitchProps extends IPropertyEditorProps<boolean> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    value: boolean | undefined;
}

/**
 * Реакт компонент, редактор булевых переменных (переключатель)
 * @class Controls-editors/_properties/SwitchEditor
 * @public
 */
export const BooleanEditorSwitch = memo((props: IBooleanEditorSwitchProps) => {
    const { type, value, onChange, LayoutComponent = Fragment } = props;
    const readOnly = type.isDisabled();

    const handleChange = useCallback(() => {
        return onChange(!value);
    }, [value, onChange]);

    return (
        <LayoutComponent>
            <Switch
                viewMode="filled"
                readOnly={readOnly}
                value={!!value}
                onValueChanged={handleChange}
                customEvents={['onValueChanged']}
                data-qa="controls-PropertyGrid__editor_switch"
            />
        </LayoutComponent>
    );
});
