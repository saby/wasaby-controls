import { memo, Fragment } from 'react';
import { IEditorLayoutProps } from 'Controls-editors/object-type';
import { IComponent, IPropertyEditorProps, ObjectMetaAttributes } from 'Types/meta';
import 'css!Controls-Buttons-editors/StyleEditor/StyleEditor';

export interface IButtonStyle {
    [name: string]: string;
}

type TValue = string | IButtonStyle;

interface IStyleEditorProps extends IPropertyEditorProps<TValue> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    value: TValue;
    attributes?: ObjectMetaAttributes<IButtonStyle>;
}

interface IColorProps {
    style: string;
    isSelected: boolean;
    options: string[];
    onClick: Function;
}

const Color = memo((props: IColorProps) => {
    return (
        <span
            className={
                `controls-styleEditor-item controls-styleEditor-item_style-${props.style}` +
                ` controls-styleEditor-item_${props.isSelected ? 'selected' : 'unselected'}`
            }
            onClick={props.onClick}
        />
    );
});

/**
 * Реакт компонент, редактор стилей
 * @class Controls-editors/_properties/StyleEditor
 * @public
 */
export const StyleEditor = memo((props: IStyleEditorProps) => {
    const { value, options = [], onChange, LayoutComponent = Fragment } = props;

    return (
        <LayoutComponent>
            <div className="controls-styleEditor">
                {options.map((color) => {
                    const clickHandler = () => {
                        onChange(color);
                    };
                    return (
                        <Color
                            data-qa="controls-PropertyGrid__editor_style"
                            onClick={clickHandler}
                            style={color}
                            isSelected={color === value}
                        />
                    );
                })}
            </div>
        </LayoutComponent>
    );
});