import { Fragment, memo, useCallback } from 'react';
import { Switch } from 'Controls/toggle';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';

interface ISwitchEditorProps extends IPropertyGridPropertyEditorProps<boolean> {}

/**
 * Реакт компонент, редактор булевых переменных (переключатель)
 * @class Controls-editors/_toggle/SwitchEditor
 * @public
 */
export const SwitchEditor = memo((props: ISwitchEditorProps) => {
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
