import { Fragment, memo, useCallback } from 'react';
import { Area as AreaControl } from 'Controls/input';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import * as rk from 'i18n!Controls-editors';

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
        onChange,
        LayoutComponent = Fragment,
        placeholder,
        minLine,
        maxLine,
    } = props;
    const readOnly = type.isDisabled();

    const onValeChanged = useCallback((value: string) => {
        return onChange(value);
    }, []);

    return (
        <LayoutComponent>
            <AreaControl
                attrs={{
                    style: { width: '100%' },
                }}
                placeholder={placeholder || rk('Ваш ответ')}
                value={value}
                minLines={minLine || 2}
                maxLines={maxLine || 3}
                readOnly={readOnly}
                onValueChanged={onValeChanged}
                customEvents={['onValueChanged']}
                data-qa="controls-PropertyGrid__editor_text_area"
            />
        </LayoutComponent>
    );
});
