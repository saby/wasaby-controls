import { Fragment, memo, useCallback } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { Text as TextControl } from 'Controls/input';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';
import * as rk from 'i18n!Controls';

interface IStringEditorProps extends IPropertyEditorProps<string> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    value: string | undefined;
    placeholder?: string;
}

/**
 * Реакт компонент, редактор строки
 * @class Controls-editors/_properties/StringEditor
 * @public
 */
export const StringEditor = memo((props: IStringEditorProps) => {
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
