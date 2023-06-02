import { Fragment, memo, useCallback } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { Text } from 'Controls/input';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';

type IThemeEditorProps = IPropertyEditorProps<string | undefined> & {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
};

/**
 * Реакт компонент, редактор выбра темы
 * @class Controls-editors/_properties/ThemeEditor
 * @public
 */
export const ThemeEditor = memo((props: IThemeEditorProps) => {
    const { type, value, onChange, LayoutComponent = Fragment } = props;
    const readOnly = type.isDisabled();

    const onInput = useCallback((e) => {
        return onChange(e.target.value || undefined);
    }, [onChange]);

    const attrs = {
        style: 'width:100%'
    };

    return (
        <LayoutComponent>
            <Text
                onInput={onInput}
                customEvents={['onInput']}
                value={value}
                readOnly={readOnly}
                data-qa='controls-PropertyGrid__editor_theme'
                attrs={attrs}
            />
        </LayoutComponent>
    );
});
