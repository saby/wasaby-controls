import { Fragment, memo, useCallback } from 'react';
import { IComponent, IPropertyEditorProps } from 'Types/meta';
import BackgroundButton, { IBackgroundButton } from 'ExtControls/BackgroundButton';
import { IEditorLayoutProps } from '../_object-type/ObjectTypeEditor';
import { toRgb, IRgba } from 'Controls/Utils/colorUtil';

interface IBackgroundEditorProps extends IPropertyEditorProps<IBackgroundButton['background']>, IBackgroundButton {
    LayoutComponent?: IComponent<IEditorLayoutProps>;
    titlePosition?: string;
}

enum RGB_COLORS {
    WHITE = '255, 255, 255',
    BLACK = '0, 0, 0'
}

function getDominantColor(rgb: IRgba, opacity: number): string {
    if (rgb) {
        if (opacity > 35) {
            return `${rgb.r}, ${rgb.g}, ${rgb.b}`;
        } else {
            return RGB_COLORS.WHITE;
        }
    } else {
        return RGB_COLORS.BLACK;
    }
}

export const BackgroundEditor = memo((props: IBackgroundEditorProps) => {
    const {value, onChange, LayoutComponent = Fragment} = props;
    const backgroundChangeHandler = useCallback((result: IBackgroundButton['background']) => {
        let dominantColorRGB: string = RGB_COLORS.WHITE;
        if (result.backgroundColor) {
            // если задан градиент, то ищем 1 цвет в формате hex
            const hexValue = result.backgroundColor.match(/(#[a-f\d]{3,8})/);
            const rgb = toRgb(hexValue?.[0] || '');
            dominantColorRGB = getDominantColor(rgb, (rgb.a * 100));
        } else if (result.image) {
            const rgb = toRgb(result.image.dominantColor || '');
            dominantColorRGB = getDominantColor(rgb, (result.image.opacity ?? (rgb.a * 100)));
        }
        result.dominantColorRGB = dominantColorRGB;
        onChange(result);
    }, [onChange]);
    return (
        <LayoutComponent titlePosition={props.titlePosition}>
            <BackgroundButton background={value}
                              onBackgroundChange={backgroundChangeHandler}
                              baseTexture={props.baseTexture}
                              headingCaption={props.headingCaption}
                              imageLoader='DOCVIEW3/backgroundImage:Button'
            />
        </LayoutComponent>
    );
});
