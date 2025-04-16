import { Fragment, memo, useCallback } from 'react';
import { TBorderVisibility, Text as TextControl } from 'Controls/input';
import { TFontWeight, TValidationStatus } from 'Controls/interface';
import {
    IPropertyGridEditorLayout,
    IPropertyGridPropertyEditorProps,
} from 'Controls-editors/propertyGrid';
import * as rk from 'i18n!Controls-editors';
import { useInputEditorValue } from './useInputValue';

/**
 * @public
 */
export interface ITextEditorProps
    extends Omit<IPropertyGridPropertyEditorProps<string | undefined | null>, 'LayoutComponent'> {
    /**
     * Текст подсказки, который отображается в пустом поле ввода
     */
    placeholder?: string;
    /**
     * Текст короткой подсказки
     */
    shortPlaceholder?: string;
    /**
     * Определяет расположение метки
     */
    titlePosition?: IPropertyGridEditorLayout['titlePosition'];
    /**
     * Определяет видимость границ контрола
     */
    borderVisibility?: TBorderVisibility;
    /**
     * Определяет размер текста
     */
    fontSize?: string;
    /**
     * Определяет жирность текста
     */
    fontWeight?: TFontWeight;
    /**
     * Максимальное количество символов, которое может ввести пользователь
     */
    maxLength?: number;
    validationStatus?: TValidationStatus;

    LayoutComponent?: IPropertyGridPropertyEditorProps<number>['LayoutComponent'];
}

/**
 * Реакт компонент, редактор строки
 * @class Controls-editors/_input/TextEditor
 * @implements Controls-editors/input:ITextEditorProps
 * @public
 */
export const TextEditor = memo((props: ITextEditorProps) => {
    const {
        value,
        onChange: onChangeOrigin,
        placeholder = rk('Ваш ответ'),
        LayoutComponent = Fragment,
        titlePosition,
        borderVisibility,
        fontSize,
        fontWeight,
        maxLength,
        metaType,
    } = props;
    const readOnly = metaType?.isDisabled();

    const { localValue, changeHandler, inputCompleteHandler } = useInputEditorValue<
        string | undefined
    >({
        value,
        onChange: onChangeOrigin,
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
                onInputCompleted={inputCompleteHandler}
                placeholder={placeholder}
                shortPlaceholder={props.shortPlaceholder}
                borderVisibility={borderVisibility}
                fontSize={fontSize}
                fontWeight={fontWeight}
                maxLength={maxLength}
                validationStatus={props.validationStatus}
            />
        </LayoutComponent>
    );
});
