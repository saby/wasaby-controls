import { Fragment, useCallback, useMemo } from 'react';
import { IPropertyGridPropertyEditorProps, PropertyGrid } from 'Controls-editors/propertyGrid';
import { IInputStyle } from 'Controls-Input/inputConnected';
import * as translate from 'i18n!Controls-Input';
import { clsx } from 'clsx';
import { BooleanType, ObjectMeta, ObjectType, StringType } from 'Meta/types';
import { parseClassNameForStyleProps } from 'Controls-Input/utils';

function generateClassName(value: IInputStyle): string {
    return clsx(
        `controls-input_size-${value.size}`,
        `controls-input_color-${value.fontColorStyle}`,
        `controls-input_${value.contrastBackground ? 'filled' : 'outlined'}`
    );
}

interface IStyleEditorProps extends IPropertyGridPropertyEditorProps<string> {
    LayoutComponent: JSX.Element;
    contrastBackgroundVisibility?: boolean;
}

interface StyleEditorMeta {
    contrastBackground?: boolean;
    size: string;
    fontColorStyle: string;
}

export function StyleEditor(props: IStyleEditorProps) {
    const {
        value,
        onChange,
        LayoutComponent = Fragment,
        contrastBackgroundVisibility = true,
    } = props;

    const style = useMemo<IInputStyle>(() => {
        return parseClassNameForStyleProps(value);
    }, [value]);

    const meta: ObjectMeta<StyleEditorMeta> = useMemo(() => {
        const properties: Record<string, unknown> = {
            size: StringType.id('size')
                .title(translate('Размер'))
                .editor('Controls-Input-editors/inputStyleEditor:InputSizeEditor', {
                    editorStyle: style,
                })
                .defaultValue('s')
                .optional()
                .order(1),
            fontColorStyle: StringType.id('fontColorStyle')
                .title(translate('Цвет текста'))
                .editor('Controls-Input-editors/inputStyleEditor:InputFontStyleColorEditor', {
                    editorStyle: style,
                })
                .defaultValue('default')
                .optional()
                .order(2),
        };

        if (contrastBackgroundVisibility) {
            properties.contrastBackground = BooleanType.id('contrastBackground')
                .title(translate('Оформление'))
                .editor('Controls-Input-editors/inputStyleEditor:InputContrastEditor', {
                    editorStyle: style,
                })
                .defaultValue(false)
                .optional()
                .order(0);
        }

        return ObjectType.properties(properties);
    }, [contrastBackgroundVisibility, style]);

    const onChangeCallback = useCallback(
        (changeValue: IInputStyle) => {
            const className = generateClassName(changeValue);
            onChange?.(className);
        },
        [onChange]
    );

    return (
        <LayoutComponent titlePosition={'none'}>
            <PropertyGrid value={style} metaType={meta} onChange={onChangeCallback} />
        </LayoutComponent>
    );
}
