import { Fragment, memo, useCallback } from 'react';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { Money as MoneyControl } from 'Controls/input';

/**
 * @public
 */
export interface IMoneyEditorProps extends IPropertyGridPropertyEditorProps<number> {}

/**
 * Реакт компонент, редактор денег
 * @class Controls-editors/_input/MoneyEditor
 * @implements Controls-editors/input:IMoneyEditorProps
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
