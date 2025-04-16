import { Fragment, memo, useCallback, useMemo, useRef } from 'react';
import { Text as TextControl } from 'Controls/input';
import { TValidationStatus } from 'Controls/interface';
import {
    IPropertyGridEditorLayout,
    IPropertyGridPropertyEditorProps,
} from 'Controls-editors/propertyGrid';
import * as rk from 'i18n!Controls-editors';
import { useInputEditorValue } from 'Controls-editors/input';
import { Button as ColorButton } from 'ExtControls/colorPicker';
import { RecordSet } from 'Types/collection';

const items = new RecordSet({
    keyProperty: 'value',
    rawData: [
        { value: 'primary', variable: '--primary_text-color' },
        { value: 'secondary', variable: '--secondary_text-color' },
        { value: 'success', variable: '--success_text-color' },
        { value: 'warning', variable: '--warning_text-color' },
        { value: 'danger', variable: '--danger_text-color' },
        { value: 'unaccented', variable: '--unaccented_text-color' },
        { value: 'link', variable: '--link_text-color' },
        { value: 'label', variable: '--label_text-color' },
        { value: 'info', variable: '--info_text-color' },
        { value: 'default', variable: '--text-color' },
    ],
});

function getStyleValue(value: string = 'label'): string {
    return `--${value}_text-color`;
}

export interface ITextEditorProps
    extends IPropertyGridPropertyEditorProps<{ title?: string; labelFontColorStyle?: string }> {
    placeholder?: string;
    shortPlaceholder?: string;
    titlePosition?: IPropertyGridEditorLayout['titlePosition'];
    validationStatus?: TValidationStatus;
}

/**
 * Реакт компонент, редактор строки
 * @class Controls-Input-editors/DataFieldEditor/LabelEditor
 * @public
 */
export const LabelEditor = memo((props: ITextEditorProps) => {
    const {
        value,
        onChange: onChangeOrigin,
        placeholder = rk('Ваш ответ'),
        LayoutComponent = Fragment,
        titlePosition,
        metaType,
    } = props;
    const readOnly = metaType?.isDisabled();
    const currentValue = useRef(value);
    currentValue.current = value;

    const selectedStyle = useMemo(() => {
        return getStyleValue(value?.labelFontColorStyle || 'label');
    }, [value?.labelFontColorStyle]);

    const onSelectedStyleChanged = useCallback((res) => {
        onChangeOrigin?.({ ...currentValue.current, labelFontColorStyle: res });
    }, []);

    const onNameChanged = useCallback((val) => {
        onChangeOrigin?.({
            ...currentValue.current,
            title: val,
        });
    }, []);

    const { localValue, changeHandler, inputCompleteHandler } = useInputEditorValue<
        string | undefined
    >({
        value: value?.title,
        onChange: onNameChanged,
    });

    const onChange = useCallback(
        (e) => {
            changeHandler(e.target.value);
        },
        [changeHandler]
    );

    let layoutProps = {};
    if (LayoutComponent !== Fragment) {
        layoutProps = { titlePosition };
    }

    return (
        <LayoutComponent {...layoutProps}>
            <TextControl
                data-qa="controls-PropertyGrid__editor_string"
                className="tw-w-full"
                value={localValue}
                readOnly={readOnly}
                onInput={onChange}
                onInputCompleted={inputCompleteHandler}
                placeholder={placeholder}
                shortPlaceholder={props.shortPlaceholder}
                validationStatus={props.validationStatus}
                rightFieldTemplate={
                    <ColorButton
                        className="controls-margin_left-s"
                        items={items}
                        keyProperty="value"
                        itemSize="s"
                        colorProperty="variable"
                        selectedKey={selectedStyle}
                        onSelectedKeyChanged={onSelectedStyleChanged}
                        columnsCount={2}
                        // @ts-ignore
                        dataQa="Controls-Input-editors_LabelEditor__style"
                    />
                }
            />
        </LayoutComponent>
    );
});
