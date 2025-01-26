import { Fragment, memo } from 'react';
import { Number as NumberInputControl } from 'Controls/input';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { useInputChanged } from 'Controls-editors/hooks';
import * as rk from 'i18n!Controls-editors';

interface INumberEditorProps extends IPropertyGridPropertyEditorProps<number> {
    placeholder?: string;
}

/**
 * Реакт компонент, редактор числа по умолчанию
 * @class Controls-editors/_properties/DefaultNumberEditor
 * @public
 */
export const DefaultNumberEditor = memo((props: INumberEditorProps) => {
    const {
        type,
        value = null,
        onChange,
        placeholder = rk('Ваш ответ'),
        LayoutComponent = Fragment,
    } = props;
    const readOnly = type.isDisabled();

    return (
        <LayoutComponent>
            <NumberInputControl
                className="tw-w-full"
                readOnly={readOnly}
                {...useInputChanged(value, onChange)}
                placeholder={placeholder}
                data-qa="controls-PropertyGrid__editor_number"
            />
        </LayoutComponent>
    );
});
