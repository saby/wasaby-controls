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
 * Реакт компонент, редактор числа
 * @class Controls-editors/_properties/NumberEditor
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
