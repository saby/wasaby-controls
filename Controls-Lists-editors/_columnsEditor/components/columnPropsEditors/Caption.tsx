import { Text } from 'Controls/input';
import * as React from 'react';
import { Button } from 'Controls/buttons';
import * as rk from 'i18n!Controls-Lists-editors';

/**
 * Редактор заголовка колонки
 * @param props
 * @constructor
 */
export function ColumnCaptionEditor(props): JSX.Element {
    const { value, onChange, placeholder } = props;
    const [caption, setCaption] = React.useState<string>(value);
    const onValueChanged = React.useCallback((newValue) => {
        setCaption(newValue);
    }, []);
    return (
        <Text
            data-qa={'ControlsListsEditors__caption'}
            placeholder={placeholder}
            fontWeight={'bold'}
            onValueChanged={onValueChanged}
            onInputCompleted={onChange}
            value={caption}
            fontSize={'xl'}
            className={'tw-w-full'}
            rightFieldTemplate={
                <Button
                    viewMode="link"
                    inlineHeight="l"
                    iconSize="s"
                    icon="icon-Yes"
                    tooltip={rk('Сохранить')}
                    iconStyle="success"
                    onClick={() => {
                        onChange(caption);
                    }}
                    data-qa={'controls_objectEditorPopup_WidgetPanelHeader_title__success'}
                />
            }
        />
    );
}
