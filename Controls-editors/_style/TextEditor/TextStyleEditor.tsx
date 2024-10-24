import { forwardRef, useCallback } from 'react';
import { ITextStyle } from '../interface';
import { ObjectMeta } from 'Meta/types';
import { PropertyGrid } from 'Controls-editors/propertyGrid';

interface IStyleTextEditorProps {
    meta: ObjectMeta;
    style: ITextStyle;
    className?: string;
    onChange?: (style: ITextStyle) => void;
}

export const TextStyleEditor = forwardRef<HTMLDivElement, IStyleTextEditorProps>(
    ({ meta, style, className = '', onChange }, ref) => {
        const onChangeCallback = useCallback(
            (newStyleMeta: object) => {
                if (typeof onChange === 'function') {
                    onChange(newStyleMeta);
                }
            },
            [onChange]
        );

        return (
            <div ref={ref} className={className}>
                <PropertyGrid metaType={meta} value={style} onChange={onChangeCallback} />
            </div>
        );
    }
);
