import { Fragment, memo } from 'react';
import { IP } from 'ExtControls/input';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import * as rk from 'i18n!Controls-editors';
import { useInputEditorValue } from './useInputValue';

/**
 * @public
 */
export interface IIPEditorProps
    extends Omit<IPropertyGridPropertyEditorProps<string | null | undefined>, 'LayoutComponent'> {
    /**
     * Текст подсказки, который отображается в пустом поле ввода
     */
    placeholder?: string;
    /**
     * Маска, которая будет применяться к полю ввода
     */
    mask?: string;

    LayoutComponent?: IPropertyGridPropertyEditorProps<string>['LayoutComponent'];
}

/**
 * Реакт компонент, редактор текста с произвольной маской
 * @class Controls-editors/_input/IPEditor
 * @implements Controls-editors/input:IIPEditorProps
 * @public
 */
export const IPEditor = memo((props: IIPEditorProps) => {
    const {
        metaType,
        value,
        onChange: onChangeOrigin,
        placeholder = rk('Введите значение'),
        LayoutComponent = Fragment,
    } = props;
    const readOnly = metaType?.isDisabled();

    const { changeHandler, localValue, inputCompleteHandler } = useInputEditorValue({
        value,
        onChange: onChangeOrigin,
    });

    return (
        <LayoutComponent>
            <IP
                placeholder={placeholder}
                className="tw-w-full"
                value={localValue}
                readOnly={readOnly}
                onValueChanged={changeHandler}
                onInputCompleted={inputCompleteHandler}
                data-qa="controls-PropertyGrid__editor_ip"
            />
        </LayoutComponent>
    );
});
