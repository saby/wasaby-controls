import { memo } from 'react';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';
import { IComponent, IPropertyEditorProps, ObjectMetaAttributes } from 'Meta/types';
import { StyleEditor } from 'Controls-Buttons-editors/StyleEditor';
import 'css!Controls-Buttons-editors/StyleEditor/StyleEditor';

export interface IButtonStyle {
    [name: string]: string;
}

interface IStyleObjectEditorProps extends IPropertyEditorProps<IButtonStyle> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    value: IButtonStyle;
    attributes?: ObjectMetaAttributes<IButtonStyle>;
}

/**
 * Реакт компонент, редактор объектов стилей
 * @class Controls-editors/_properties/StyleEditor
 * @public
 */
export const StyleObjectEditor = memo((props: IStyleObjectEditorProps) => {
    const { value, attributes, onChange } = props;

    const onChangeHandler = (color: string) => {
        const res = {};
        Object.keys(attributes).forEach((key) => {
            res[key] = color;
        });
        onChange(res);
    };
    const selectedValue = Object.values(value)[0];

    return <StyleEditor {...props} onChange={onChangeHandler} value={selectedValue} />;
});
