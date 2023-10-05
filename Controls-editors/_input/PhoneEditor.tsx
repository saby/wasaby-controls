import { Fragment, memo, useCallback } from 'react';
import { Phone as PhoneControl } from 'Controls/input';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import * as rk from 'i18n!Controls-editors';

interface IPhoneEditorProps extends IPropertyGridPropertyEditorProps<string> {
    placeholder?: string;
}

/**
 * Реакт компонент, редактор номера телефона
 * @class Controls-editors/_input/PhoneEditor
 * @public
 */
export const PhoneEditor = memo((props: IPhoneEditorProps) => {
    const { type, value, onChange, placeholder = rk('Номер телефона'), LayoutComponent = Fragment } = props;
    const readOnly = type.isDisabled();

    const onValeChanged = useCallback((value: string) => {
        return onChange(value);
    }, []);

    return (
        <LayoutComponent>
            <PhoneControl
                placeholder={placeholder}
                className='tw-w-full'
                value={value}
                readOnly={readOnly}
                onValueChanged={onValeChanged}
                customEvents={['onValueChanged']}
                data-qa="controls-PropertyGrid__editor_phone"
            />
        </LayoutComponent>
    );
});