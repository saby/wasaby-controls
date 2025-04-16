import { Fragment, memo, useCallback } from 'react';
import { Toggle } from 'Controls/dropdown';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { useReadonly } from 'UI/Contexts';

interface IBooleanEditorProps extends Partial<IPropertyGridPropertyEditorProps<boolean>> {}

/**
 * Реакт компонент, редактор булевых переменных (переключатель)
 * @class Controls-editors/_toggle/SwitchEditor
 * @public
 */
export const BooleanEditor = memo((props: IBooleanEditorProps) => {
    const { type, value, onChange, LayoutComponent = Fragment } = props;
    const readOnly = useReadonly() || type.isDisabled();

    const handleChange = useCallback(
        (res) => {
            return onChange(res?.[0]);
        },
        [onChange]
    );

    return (
        <LayoutComponent>
            <Toggle
                viewMode="filled"
                readOnly={readOnly}
                selectedKeys={[value]}
                onSelectedKeysChanged={handleChange}
                data-qa="controls-PropertyGrid__editor_switch"
            />
        </LayoutComponent>
    );
});
