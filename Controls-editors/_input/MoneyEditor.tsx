import { Fragment, memo } from 'react';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { Money as MoneyControl } from 'Controls/input';
import { useInputEditorValue } from './useInputValue';

/**
 * @public
 */
export interface IMoneyEditorProps
    extends Omit<IPropertyGridPropertyEditorProps<number | null | undefined>, 'LayoutComponent'> {
    LayoutComponent?: IPropertyGridPropertyEditorProps<number>['LayoutComponent'];
}

/**
 * Реакт компонент, редактор денег
 * @class Controls-editors/_input/MoneyEditor
 * @implements Controls-editors/input:IMoneyEditorProps
 * @public
 */
export const MoneyEditor = memo((props: IMoneyEditorProps) => {
    const { metaType, value, onChange: onChangeOrigin, LayoutComponent = Fragment } = props;
    const readOnly = metaType?.isDisabled();

    const { changeHandler, localValue, inputCompleteHandler } = useInputEditorValue({
        value,
        onChange: onChangeOrigin,
    });

    return (
        <LayoutComponent>
            <MoneyControl
                value={localValue === undefined ? 0 : localValue}
                textAlign={'right'}
                className="controls-Input__width-5ch"
                readOnly={readOnly}
                onValueChanged={changeHandler}
                onInputCompleted={inputCompleteHandler}
                data-qa="controls-PropertyGrid__editor_money"
            />
        </LayoutComponent>
    );
});
