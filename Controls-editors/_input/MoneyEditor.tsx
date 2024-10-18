import { Fragment, memo, useCallback } from 'react';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { Money as MoneyControl } from 'Controls/input';
import { useInputEditorValue } from './useInputValue';

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
    const { type, value, onChange: onChangeOrigin, LayoutComponent = Fragment } = props;
    const readOnly = type.isDisabled();

    const { changeHandler, localValue } = useInputEditorValue({
        value,
    });

    const onChange = useCallback(
        (value: unknown) => {
            changeHandler(value as number);
        },
        [changeHandler]
    );

    return (
        <LayoutComponent>
            <MoneyControl
                value={localValue === undefined ? 0 : localValue}
                textAlign={'right'}
                className="controls-Input__width-5ch"
                readOnly={readOnly}
                onValueChanged={onChange}
                onInputCompleted={onChangeOrigin}
                data-qa="controls-PropertyGrid__editor_money"
            />
        </LayoutComponent>
    );
});
