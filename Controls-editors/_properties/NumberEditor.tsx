import { Fragment, memo, useCallback } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { Number as NumberInputControl } from 'Controls/input';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';

interface INumberEditorProps extends IPropertyEditorProps<number> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    value: number | undefined;
}

/**
 * Реакт компонент, редактор для выбора из перечисляемых строк
 * @class Controls-editors/_properties/NumberEditor
 * @public
 */
export const NumberEditor = memo((props: INumberEditorProps) => {
    const { type, value, onChange, LayoutComponent = Fragment } = props;
    const readOnly = type.isDisabled();
    const onInput = useCallback((e) => {
        return onChange(Number(e.target.value) || 0);
    }, []);

    return (
        <LayoutComponent>
            <NumberInputControl
                textAlign={'right'}
                className="controls-Input__width-5ch"
                value={value}
                readOnly={readOnly}
                onInput={onInput}
                data-qa="controls-PropertyGrid__editor_number"
            />
        </LayoutComponent>
    );
});
