import { Fragment, memo, useCallback } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { Text as TextControl } from 'Controls/input';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';
import * as rk from 'i18n!Controls';

interface IStringEditorProps extends IPropertyEditorProps<string> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    value: string | undefined;
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

    const onInput = useCallback((e) => {
        return onChange(e.target.value);
    }, []);

    return (
        <LayoutComponent>
            <>
                <TextControl
                    data-qa="controls-PropertyGrid__editor_mask"
                    attrs={{
                        style: {width: '100%'},
                    }}
                    value={value}
                    readOnly={readOnly}
                    onInput={onInput}
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
