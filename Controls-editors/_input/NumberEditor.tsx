import { Fragment, memo } from 'react';
import { Number as NumberInputControl } from 'Controls/input';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import * as rk from 'i18n!Controls-editors';
import { useInputEditorValue } from './useInputValue';

/**
 * @public
 */
export interface INumberEditorProps extends IPropertyGridPropertyEditorProps<number> {
    /**
     * Текст подсказки, который отображается в пустом поле ввода
     */
    placeholder?: string;
    /**
     * Максимальная длина целой части
     */
    integersLength?: number;
}

/**
 * Реакт компонент, редактор числа
 * @class Controls-editors/_input/NumberEditor
 * @implements Controls-editors/input:INumberEditorProps
 * @public
 */
export const NumberEditor = memo((props: INumberEditorProps) => {
    const {
        type,
        value = null,
        onChange: onChangeOrigin,
        placeholder = rk('Ваш ответ'),
        integersLength,
        LayoutComponent = Fragment,
    } = props;
    const readOnly = type.isDisabled();

    const { changeHandler, localValue, inputCompleteHandler } = useInputEditorValue({
        value,
        onChange: onChangeOrigin,
    });

    return (
        <LayoutComponent>
            <NumberInputControl
                textAlign={'right'}
                className="controls-Input__width-5ch"
                value={localValue}
                readOnly={readOnly}
                integersLength={integersLength}
                valueChangedCallback={changeHandler}
                onInputCompleted={inputCompleteHandler}
                placeholder={placeholder}
                data-qa="controls-PropertyGrid__editor_number"
            />
        </LayoutComponent>
    );
});
