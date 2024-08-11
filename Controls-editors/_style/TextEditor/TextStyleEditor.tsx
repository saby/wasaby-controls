import { forwardRef, useCallback, useMemo } from 'react';
import { ITextStyle, ITextStyleMeta, TFontStyle, TFontWeight, TTextDecoration } from '../interface';
import { ObjectMeta } from 'Meta/types';
import { PropertyGrid } from 'Controls-editors/propertyGrid';

function createTextStyle(meta: ITextStyleMeta): ITextStyle {
    const result = { ...meta };

    if (meta.hasOwnProperty('decorator')) {
        (result as unknown as ITextStyle).fontStyle = meta.decorator?.fontStyle;
        (result as unknown as ITextStyle).fontWeight = meta.decorator?.fontWeight;
        (result as unknown as ITextStyle).textDecoration = meta.decorator?.textDecoration;

        delete result.decorator;
    }

    return result as unknown as ITextStyle;
}

function createStyleMetaValue(textStyle: ITextStyle): ITextStyleMeta {
    const result = { ...textStyle };

    if (
        textStyle.hasOwnProperty('fontStyle') &&
        textStyle.hasOwnProperty('fontWeight') &&
        textStyle.hasOwnProperty('textDecoration')
    ) {
        (result as unknown as ITextStyleMeta).decorator = {
            fontStyle: textStyle.fontStyle as TFontStyle,
            fontWeight: textStyle.fontWeight as TFontWeight,
            textDecoration: textStyle.textDecoration as TTextDecoration,
        };

        delete result.fontStyle;
        delete result.fontWeight;
        delete result.textDecoration;
    }

    return result as unknown as ITextStyleMeta;
}

interface IStyleTextEditorProps {
    meta: ObjectMeta;
    style: ITextStyle;
    className?: string;
    onChange?: (style: ITextStyle) => void;
}

export const TextStyleEditor = forwardRef<HTMLDivElement, IStyleTextEditorProps>(
    ({ meta, style, className = '', onChange }, ref) => {
        const styleMeta = useMemo(() => {
            return createStyleMetaValue(style);
        }, [style]);
        const onChangeCallback = useCallback(
            (newStyleMeta: ITextStyleMeta) => {
                if (typeof onChange === 'function') {
                    const newTextStyle = createTextStyle(newStyleMeta);
                    onChange(newTextStyle);
                }
            },
            [onChange]
        );

        return (
            <div ref={ref} className={className}>
                <PropertyGrid
                    className="TextEditor__PropertyGrid"
                    metaType={meta}
                    value={styleMeta}
                    onChange={onChangeCallback}
                />
            </div>
        );
    }
);
