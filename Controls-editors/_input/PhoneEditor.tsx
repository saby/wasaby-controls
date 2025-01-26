import { Fragment, memo } from 'react';
import { Phone as PhoneControl } from 'Controls/input';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import * as rk from 'i18n!Controls-editors';
import { useInputEditorValue } from './useInputValue';

/**
 * @public
 */
export interface IPhoneEditorProps extends IPropertyGridPropertyEditorProps<string> {
    /**
     * Текст подсказки, который отображается в пустом поле ввода
     */
    placeholder?: string;
}

/**
 * Реакт компонент, редактор номера телефона
 * @class Controls-editors/_input/PhoneEditor
 * @implements Controls-editors/input:IPhoneEditorProps
 * @public
 */
export const PhoneEditor = memo((props: IPhoneEditorProps) => {
    const {
        type,
        value,
        onChange: onChangeOrigin,
        placeholder = rk('Номер телефона'),
        LayoutComponent = Fragment,
    } = props;
    const readOnly = type.isDisabled();

    const { changeHandler, localValue, inputCompleteHandler } = useInputEditorValue({
        value,
        onChange: onChangeOrigin,
    });

    return (
        <LayoutComponent>
            <PhoneControl
                placeholder={placeholder}
                className="tw-w-full"
                value={localValue}
                readOnly={readOnly}
                onValueChanged={changeHandler}
                onInputCompleted={inputCompleteHandler}
                data-qa="controls-PropertyGrid__editor_phone"
            />
        </LayoutComponent>
    );
});
