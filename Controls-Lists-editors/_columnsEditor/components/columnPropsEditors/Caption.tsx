import { Text } from 'Controls/input';
import * as React from 'react';

/**
 * Редактор заголовка колонки
 * @param props
 * @constructor
 */
export function ColumnCaptionEditor(props): JSX.Element {
    const { value, onChange, placeholder } = props;
    const [caption, setCaption] = React.useState<string>(value);
    React.useEffect(() => {
        setCaption(value);
    }, [value]);
    const onValueChanged = React.useCallback((newValue) => {
        setCaption(newValue);
    }, []);
    const onInputCompleted = React.useCallback(
        (newValue) => {
            onChange(newValue);
        },
        [onChange]
    );
    return (
        <Text
            data-qa={'ControlsListsEditors__caption'}
            placeholder={placeholder}
            fontWeight={'bold'}
            onInputCompleted={onInputCompleted}
            onValueChanged={onValueChanged}
            value={caption}
            fontSize={'xl'}
            className={'tw-w-full'}
        />
    );
}
