import { Fragment, memo, useCallback } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { Text as TextControl } from 'Controls/input';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';

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
        placeholder = 'Введите текст',
        LayoutComponent = Fragment,
    } = props;
    const readOnly = type.isDisabled();

    const onInput = useCallback((e) => {
        return onChange(e.target.value);
    }, []);

    return (
        <LayoutComponent>
            <TextControl
                attrs={{
                    style: { width: '100%' },
                }}
                value={value}
                readOnly={readOnly}
                onInput={onInput}
                placeholder={placeholder}
            />
        </LayoutComponent>
    );
});
