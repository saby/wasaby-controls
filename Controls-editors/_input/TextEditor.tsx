import { Fragment, memo, useCallback } from 'react';
import { Text as TextControl } from 'Controls/input';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import * as rk from 'i18n!Controls-editors';

interface ITextEditorProps extends IPropertyGridPropertyEditorProps<string> {
    placeholder?: string;
}

/**
 * Реакт компонент, редактор строки
 * @class Controls-editors/_input/TextEditor
 * @public
 */
export const TextEditor = memo((props: ITextEditorProps) => {
    const {
        type,
        value,
        onChange,
        placeholder = rk('Ваш ответ'),
        LayoutComponent = Fragment,
    } = props;
    const readOnly = type.isDisabled();

    const onInput = useCallback((e) => {
        return onChange(e.target.value);
    }, []);

    return (
        <LayoutComponent>
            <TextControl
                data-qa="controls-PropertyGrid__editor_string"
                className='tw-w-full'
                value={value}
                readOnly={readOnly}
                onInput={onInput}
                placeholder={placeholder}
            />
        </LayoutComponent>
    );
});
