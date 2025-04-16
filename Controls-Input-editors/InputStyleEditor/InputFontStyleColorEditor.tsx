import { forwardRef, LegacyRef, useCallback } from 'react';
import { Selector as SelectorControl } from 'Controls/dropdown';
import { RecordSet } from 'Types/collection';
import { IInputStyle } from 'Controls-Input/inputConnected';
import { Button as ColorPicker } from 'ExtControls/colorPicker';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { WidgetThemeWrapper, useWidgetThemeClasses } from 'Controls-editors/propertyGridPopup';
import 'css!Controls-Input-editors/InputStyleEditor/InputFontStyleColorEditor';

interface IProps extends IPropertyGridPropertyEditorProps<string> {
    editorStyle: IInputStyle;
    LayoutComponent: JSX.Element;
}

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

export default forwardRef(function InputTextColorEditor(
    props: IProps,
    ref: LegacyRef<SelectorControl>
) {
    const { onChange, editorStyle, LayoutComponent } = props;

    const onSelectedKeyChanged = useCallback(
        (value: number | string | null) => {
            if (value) {
                onChange?.(value.toString());
            }
        },
        [onChange]
    );

    return (
        <LayoutComponent>
            <WidgetThemeWrapper>
                <ColorPicker
                    ref={ref}
                    className="controls-InputFontStyleColorEditor"
                    itemSize="m"
                    columnsCount={2}
                    selectedKey={editorStyle.fontColorStyle}
                    onSelectedKeyChanged={onSelectedKeyChanged}
                    items={items}
                    keyProperty="value"
                    colorProperty="variable"
                    panelClassName={useWidgetThemeClasses()}
                />
            </WidgetThemeWrapper>
        </LayoutComponent>
    );
});
