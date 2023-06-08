import * as rk from 'i18n!Controls';
import { Fragment, memo, useContext } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { ObjectTypeEditorRootContext } from '../object-type';
import { IEditorLayoutProps } from '../object-type';

type IObjectEditorProps = IPropertyEditorProps<object> & {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
};

/**
 * Реакт компонент, редактор объекта
 * @class Controls-editors/_properties/ObjectEditor
 * @public
 */
export const ObjectEditor = memo((props: IObjectEditorProps) => {
    const { open } = useContext(ObjectTypeEditorRootContext);
    const { name, LayoutComponent = Fragment } = props;

    const handleClick = (event) => {
        event.preventDefault();
        open(name);
    };

    return (
        <LayoutComponent>
            <a href="#" onClick={handleClick}>
                {rk('Изменить')}
            </a>
        </LayoutComponent>
    );
});
