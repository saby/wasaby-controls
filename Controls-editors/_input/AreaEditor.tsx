import { Fragment, memo, useCallback } from 'react';
import { Area as AreaControl } from 'Controls/input';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import * as rk from 'i18n!Controls-editors';
import { useInputEditorValue } from './useInputValue';

/**
 * @public
 */
export interface IAreaEditorProps extends IPropertyGridPropertyEditorProps<string> {
    /**
     * Текст подсказки, который отображается в пустом поле ввода
     */
    placeholder?: string;
    /**
     * Минимальное количество строк.
     */
    minLine?: number;
    /**
     * Максимальное количество строк.
     */
    maxLine?: number;
}

/**
 * Реакт компонент, редактор многострочного текста
 * @class Controls-editors/_input/AreaEditor
 * @implements Controls-editors/input:IAreaEditorProps
 * @public
 */
export const AreaEditor = memo((props: IAreaEditorProps) => {
    const {
        type,
        value,
        onChange: onChangeOrigin,
        LayoutComponent = Fragment,
        placeholder,
        minLine,
        maxLine,
    } = props;
    const readOnly = type.isDisabled();

    const { changeHandler, localValue } = useInputEditorValue({
        value,
    });

    const onChange = useCallback(
        (value: unknown) => {
            changeHandler(value as string);
        },
        [changeHandler]
    );

    return (
        <LayoutComponent>
            <AreaControl
                attrs={{
                    style: { width: '100%' },
                }}
                placeholder={placeholder || rk('Ваш ответ')}
                value={localValue}
                minLines={minLine || 2}
                maxLines={maxLine || 3}
                readOnly={readOnly}
                onValueChanged={onChange}
                onInputCompleted={onChangeOrigin}
                data-qa="controls-PropertyGrid__editor_text_area"
            />
        </LayoutComponent>
    );
});
