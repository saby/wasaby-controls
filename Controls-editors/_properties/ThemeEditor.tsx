import { Fragment, memo } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { createElement } from 'UICore/Jsx';
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
    const options = { value, readOnly };
    const events = {
        'on:input': [
            (e) => {
                return onChange(e.target.value || undefined);
            },
        ],
    };
    const attrs = { style: 'width:100%' };
    return (
        <LayoutComponent>
            {createElement(Text, options, attrs, events)}
        </LayoutComponent>
    );
});
