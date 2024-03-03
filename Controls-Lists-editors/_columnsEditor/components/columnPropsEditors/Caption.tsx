import { Text } from 'Controls/input';
import * as React from 'react';

/**
 * Редактор заголовка колонки
 * @param props
 * @constructor
 */
export function ColumnCaptionEditor(props): JSX.Element {
    const { value, onChange, LayoutComponent } = props;
    const [localValue, setLocalValue] = React.useState(value?.custom || '');
    const onInputCompleted = React.useCallback(
        (newValue) => {
            onChange({
                ...value,
                custom: newValue,
            });
        },
        [onChange, value]
    );
    const onValueChanged = React.useCallback((newValue) => {
        setLocalValue(newValue);
    }, []);
    return (
        <LayoutComponent>
            <Text
                data-qa={'ControlsListsEditors__caption'}
                placeholder={value.default}
                fontWeight={'bold'}
                onInputCompleted={onInputCompleted}
                onValueChanged={onValueChanged}
                value={localValue}
            />
        </LayoutComponent>
    );
}
