import { Fragment, memo } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { createElement } from 'UICore/Jsx';
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
    const options = { viewMode: 'filled', readOnly, value: !!value };
    const events = {
        'on:valueChanged': [
            () => {
                return onChange(!value);
            },
        ],
    };
    const attrs = {};
    return (
        <LayoutComponent>
            {createElement(Switch, options, attrs, events)}
        </LayoutComponent>
    );
});
