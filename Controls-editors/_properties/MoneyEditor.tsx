import { Fragment, memo, useCallback } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { Money as MoneyControl } from 'Controls/input';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';

interface IMoneyEditorProps extends IPropertyEditorProps<number> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
}

/**
 * Реакт компонент, редактор денег
 * @class Controls-editors/_properties/MoneyEditor
 * @public
 */
export const MoneyEditor = memo((props: IMoneyEditorProps) => {
    const { type, value, onChange, LayoutComponent = Fragment } = props;
    const readOnly = type.isDisabled();

    const onValeChanged = useCallback((value: number) => {
        return onChange(value);
    }, []);

    return (
        <LayoutComponent>
            <MoneyControl
                value={value === undefined ? 0 : value}
                textAlign={'right'}
                className="controls-Input__width-5ch"
                readOnly={readOnly}
                onValueChanged={onValeChanged}
                customEvents={['onValueChanged']}
                data-qa="controls-PropertyGrid__editor_money"
            />
        </LayoutComponent>
    );
});
