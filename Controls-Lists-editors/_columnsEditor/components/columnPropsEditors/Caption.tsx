import { Text } from 'Controls/input';
import * as React from 'react';

/**
 * Редактор заголовка колонки
 * @param props
 * @constructor
 */
export function ColumnCaptionEditor(props): JSX.Element {
    const { value, onChange, LayoutComponent } = props;
    const [caption, setCaption] = React.useState(value.custom);
    const onValueChanged = React.useCallback((newValue) => {
        setCaption(newValue);
    }, []);
    const onInputCompleted = React.useCallback(
        (newValue) => {
            onChange({
                ...value,
                custom: newValue,
            });
        },
        [onChange, value]
    );
    return (
        <LayoutComponent>
            <Text
                data-qa={'ControlsListsEditors__caption'}
                placeholder={value.default}
                fontWeight={'bold'}
                onInputCompleted={onInputCompleted}
                onValueChanged={onValueChanged}
                value={caption}
            />
        </LayoutComponent>
    );
}
