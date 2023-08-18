import { Fragment, memo } from 'react';
import { Number as NumberInputControl } from 'Controls/input';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import * as rk from 'i18n!Controls-editors';

interface INumberEditorProps extends IPropertyGridPropertyEditorProps<number> {
    placeholder?: string;
}

/**
 * Реакт компонент, редактор числа
 * @class Controls-editors/_input/NumberEditor
 * @public
 */
export const NumberEditor = memo((props: INumberEditorProps) => {
    const { type, value = null, onChange, placeholder = rk('Ваш ответ'), LayoutComponent = Fragment } = props;
    const readOnly = type.isDisabled();

    return (
        <LayoutComponent>
            <NumberInputControl
                textAlign={'right'}
                className="controls-Input__width-5ch"
                value={value}
                readOnly={readOnly}
                valueChangedCallback={onChange}
                placeholder={placeholder}
                data-qa="controls-PropertyGrid__editor_number"
            />
        </LayoutComponent>
    );
});
