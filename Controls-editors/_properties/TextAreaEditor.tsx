import { Fragment, memo, useCallback } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import { Area as AreaControl } from 'Controls/input';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';
import * as rk from 'i18n!Controls';

interface ITextAreaEditorProps extends IPropertyEditorProps<string> {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
}

/**
 * Реакт компонент, редактор многострочного текста
 * @class Controls-editors/_properties/TextAreaEditor
 * @public
 */
export const TextAreaEditor = memo((props: ITextAreaEditorProps) => {
    const { type, value, onChange, LayoutComponent = Fragment } = props;
    const readOnly = type.isDisabled();

    const onValeChanged = useCallback((value: string) => {
        return onChange(value);
    }, []);

    return (
        <LayoutComponent>
            <AreaControl
                attrs={{
                    style: { width: '100%' },
                }}
                placeholder={rk('Ваш ответ')}
                value={value}
                minLines={2}
                maxLines={3}
                readOnly={readOnly}
                onValueChanged={onValeChanged}
                customEvents={['onValueChanged']}
                data-qa="controls-PropertyGrid__editor_text_area"
            />
        </LayoutComponent>
    );
});
