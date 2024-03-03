import { Fragment, memo } from 'react';
import { Text as TextControl } from 'Controls/input';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { useInputChanged } from 'Controls-editors/hooks';
import * as rk from 'i18n!Controls-editors';

interface IStringEditorProps extends IPropertyGridPropertyEditorProps<string> {
    placeholder?: string;
}

/**
 * Реакт компонент, редактор маски
 * @class Controls-editors/_properties/MaskEditor
 * @public
 */
export const MaskEditor = memo((props: IStringEditorProps) => {
    const {
        type,
        value,
        onChange,
        placeholder = rk('Введите значение маски'),
        LayoutComponent = Fragment,
    } = props;
    const readOnly = type.isDisabled();

    return (
        <LayoutComponent>
            <>
                <TextControl
                    data-qa="controls-PropertyGrid__editor_mask"
                    attrs={{
                        style: { width: '100%' },
                    }}
                    readOnly={readOnly}
                    {...useInputChanged(value, onChange)}
                    placeholder={placeholder}
                />
                <div className="controls-text-readonly controls-fontsize-xs controls-margin_top-s">
                    <div>Укажите маску из следующих символов:</div>
                    <div>d — цифра,</div>
                    <div>L — прописная буква,</div>
                    <div>l — строчная буква,</div>
                    <div>x — буква или цифра.</div>
                </div>
            </>
        </LayoutComponent>
    );
});
