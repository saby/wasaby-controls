import * as rk from 'i18n!Controls';
import { Fragment, memo } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
// import { ObjectTypeEditorRootContext } from '../object-type';
import { IEditorLayoutProps } from '../object-type';

type IObjectEditorProps = IPropertyEditorProps<object> & {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
};

// TODO: Редактор реализуется по задаче:
//  https://online.sbis.ru/opendoc.html?guid=fad845e9-06c8-4cb5-9413-aee6d0568112&client=3
/**
 * Реакт компонент, редактор объекта
 * @class Controls-editors/_properties/ObjectEditor
 * @public
 */
export const ObjectEditor = memo((props: IObjectEditorProps) => {
    // const { open } = useContext(ObjectTypeEditorRootContext);
    const { name, LayoutComponent = Fragment } = props;

    const handleClick = (event) => {
        event.preventDefault();
        // open(name);
    };

    return (
        <LayoutComponent>
            <a
                href="#"
                onClick={handleClick}
                data-qa="controls-PropertyGrid__editor_object"
            >
                {rk('Изменить')}
            </a>
        </LayoutComponent>
    );
});
