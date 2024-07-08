import { Fragment, memo, useCallback } from 'react';
import { IBorderVisibility, Text as TextControl } from 'Controls/input';
import { IFontSize, IFontWeight } from 'Controls/interface';
import {
    IPropertyGridEditorLayout,
    IPropertyGridPropertyEditorProps,
} from 'Controls-editors/propertyGrid';
import * as rk from 'i18n!Controls-editors';
import { useInputEditorValue } from './useInputValue';

/**
 * @public
 */
export interface ITextEditorProps extends IPropertyGridPropertyEditorProps<string> {
    /**
     * Текст подсказки, который отображается в пустом поле ввода
     */
    placeholder?: string;
    /**
     * Определяет расположение метки
     */
    titlePosition?: IPropertyGridEditorLayout['titlePosition'];
    /**
     * Определяет видимость границ контрола
     */
    borderVisibility?: IBorderVisibility;
    /**
     * Определяет размер текста
     */
    fontSize?: IFontSize;
    /**
     * Определяет жирность текста
     */
    fontWeight?: IFontWeight;
    /**
     * Максимальное количество символов, которое может ввести пользователь
     */
    maxLength?: number;
}

/**
 * Реакт компонент, редактор строки
 * @class Controls-editors/_input/TextEditor
 * @implements Controls-editors/input:ITextEditorProps
 * @public
 */
export const TextEditor = memo((props: ITextEditorProps) => {
    const {
        type,
        value,
        onChange: onChangeOrigin,
        placeholder = rk('Ваш ответ'),
        LayoutComponent = Fragment,
        titlePosition,
        borderVisibility,
        fontSize,
        fontWeight,
        maxLength,
    } = props;
    const readOnly = type.isDisabled();

    const { localValue, changeHandler, onApply } = useInputEditorValue({
        value,
        onApply: onChangeOrigin,
    });

    const onChange = useCallback(
        (e) => {
            changeHandler(e.target.value);
        },
        [changeHandler]
    );
    let layoutProps = {};
    if (LayoutComponent !== Fragment) {
        layoutProps = { titlePosition };
    }

    return (
        <LayoutComponent {...layoutProps}>
            <TextControl
                data-qa="controls-PropertyGrid__editor_string"
                className="tw-w-full"
                value={localValue}
                readOnly={readOnly}
                onInput={onChange}
                onInputCompleted={onApply}
                placeholder={placeholder}
                borderVisibility={borderVisibility}
                fontSize={fontSize}
                fontWeight={fontWeight}
                maxLength={maxLength}
            />
        </LayoutComponent>
    );
});
