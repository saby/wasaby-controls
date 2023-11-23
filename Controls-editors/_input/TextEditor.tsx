import { Fragment, memo, useCallback } from 'react';
import { Text as TextControl, IBorderVisibility } from 'Controls/input';
import { IFontSize, IFontWeight } from 'Controls/interface';
import {
    IPropertyGridPropertyEditorProps,
    IPropertyGridEditorLayout,
} from 'Controls-editors/propertyGrid';
import * as rk from 'i18n!Controls-editors';

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
        onChange,
        placeholder = rk('Ваш ответ'),
        LayoutComponent = Fragment,
        titlePosition,
        borderVisibility,
        fontSize,
        fontWeight,
    } = props;
    const readOnly = type.isDisabled();

    const onInput = useCallback(
        (e) => {
            return onChange(e.target.value);
        },
        [onChange]
    );

    return (
        <LayoutComponent titlePosition={titlePosition}>
            <TextControl
                data-qa="controls-PropertyGrid__editor_string"
                className="tw-w-full"
                value={value}
                readOnly={readOnly}
                onInput={onInput}
                placeholder={placeholder}
                borderVisibility={borderVisibility}
                fontSize={fontSize}
                fontWeight={fontWeight}
            />
        </LayoutComponent>
    );
});
