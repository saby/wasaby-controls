import { Fragment, memo } from 'react';
import { Mask as MaskControl } from 'Controls/input';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import * as rk from 'i18n!Controls-editors';
import { useInputEditorValue } from './useInputValue';

/**
 * @public
 */
export interface IMaskEditorProps
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
 * @class Controls-editors/_input/MaskEditor
 * @implements Controls-editors/input:IMaskEditorProps
 * @public
 */
export const MaskEditor = memo((props: IMaskEditorProps) => {
    const {
        metaType,
        value,
        onChange: onChangeOrigin,
        mask = 'dd.dddd',
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
            <MaskControl
                placeholder={placeholder}
                className="tw-w-full"
                value={localValue}
                mask={mask}
                readOnly={readOnly}
                onValueChanged={changeHandler}
                onInputCompleted={inputCompleteHandler}
                data-qa="controls-PropertyGrid__editor_mask"
            />
        </LayoutComponent>
    );
});
