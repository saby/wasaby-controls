import { Text } from 'Controls/input';
import * as React from 'react';

/**
 * Редактор заголовка колонки
 * @param props
 * @constructor
 */
export function ColumnCaptionEditor(props): JSX.Element {
    const { value, onChange, LayoutComponent } = props;
    const onValueChanged = React.useCallback(
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
                onValueChanged={onValueChanged}
                value={value.custom}
            />
        </LayoutComponent>
    );
}
