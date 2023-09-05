import { Fragment, memo } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { Number as NumberInputControl } from 'Controls/input';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';
import * as rk from 'i18n!Controls-editors';

interface INumberEditorProps extends IPropertyEditorProps<number> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    value: number | undefined;
    placeholder?: string;
}

/**
 * Реакт компонент, редактор числа по умолчанию
 * @class Controls-editors/_properties/DefaultNumberEditor
 * @public
 */
export const DefaultNumberEditor = memo((props: INumberEditorProps) => {
    const { type, value = null, onChange, placeholder = rk('Ваш ответ'), LayoutComponent = Fragment } = props;
    const readOnly = type.isDisabled();

    return (
        <LayoutComponent>
            <NumberInputControl
                className="tw-w-full"
                value={value}
                readOnly={readOnly}
                valueChangedCallback={onChange}
                placeholder={placeholder}
                data-qa="controls-PropertyGrid__editor_number"
            />
        </LayoutComponent>
    );
});
