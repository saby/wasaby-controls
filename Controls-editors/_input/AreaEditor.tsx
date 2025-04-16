import { Fragment, memo } from 'react';
import { Area as AreaControl, IAreaOptions } from 'Controls/input';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import * as rk from 'i18n!Controls-editors';
import { useInputEditorValue } from './useInputValue';

/**
 * @public
 */
export interface IAreaEditorProps
    extends Omit<IPropertyGridPropertyEditorProps<string | null | undefined>, 'LayoutComponent'> {
    /**
     * Текст подсказки, который отображается в пустом поле ввода
     */
    placeholder?: string;
    /**
     * Минимальное количество строк.
     */
    minLine?: number;
    /**
     * Максимальное количество строк.
     */
    maxLine?: number;
    readonlyViewMode?: IAreaOptions['readonlyViewMode'];

    LayoutComponent?: IPropertyGridPropertyEditorProps<string>['LayoutComponent'];
    titlePosition?: string;
}

/**
 * Реакт компонент, редактор многострочного текста
 * @class Controls-editors/_input/AreaEditor
 * @implements Controls-editors/input:IAreaEditorProps
 * @public
 */
export const AreaEditor = memo((props: IAreaEditorProps) => {
    const {
        metaType,
        value,
        onChange: onChangeOrigin,
        LayoutComponent = Fragment,
        placeholder,
        minLine,
        maxLine,
        readonlyViewMode,
        titlePosition,
    } = props;
    const readOnly = metaType?.isDisabled();

    const { changeHandler, localValue, inputCompleteHandler } = useInputEditorValue({
        value,
        onChange: onChangeOrigin,
    });

    return (
        <LayoutComponent titlePosition={titlePosition}>
            <AreaControl
                attrs={{
                    style: { width: '100%' },
                }}
                placeholder={placeholder || rk('Ваш ответ')}
                value={localValue}
                minLines={minLine || 2}
                maxLines={maxLine || 3}
                readonlyViewMode={readonlyViewMode}
                readOnly={readOnly}
                onValueChanged={changeHandler}
                onInputCompleted={inputCompleteHandler}
                data-qa="controls-PropertyGrid__editor_text_area"
            />
        </LayoutComponent>
    );
});
