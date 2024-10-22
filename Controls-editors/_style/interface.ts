export type TFontFamily = string;
export type TFontSize = string; // число + ед измерения
export type TColor = string; // значение или ссылка на другой цвет
export type TFontWeight = 'bold' | 'normal';
export type TFontStyle = 'italic' | 'normal';
export type TTextDecoration = 'underline' | 'line-through' | 'none';
export type TTextAlign = 'left' | 'right' | 'center' | 'justify';
export type TTextTransform = 'none' | 'capitalize' | 'uppercase' | 'lowercase';
export type TLineHeight = string; // число + ед измерения

export interface ITextStyle {
    color?: TColor;
    fontFamily?: TFontFamily;
    fontSize?: TFontSize;
    fontStyle?: TFontStyle;
    fontWeight?: TFontWeight;
    lineHeight?: TLineHeight;
    textAlign?: TTextAlign;
    textDecoration?: TTextDecoration;
    textTransform?: TTextTransform;
}

export interface ITextStyleMeta {
    fontFamily?: TFontFamily;
    fontSize?: TFontSize;
    lineHeight?: TLineHeight;
    textAlign?: TTextAlign;
    textTransform?: TTextTransform;
    decorator?: {
        fontStyle: TFontStyle;
        fontWeight: TFontWeight;
        textDecoration: TTextDecoration;
    };
    color: TColor;
}

export interface ITextStyleModel {
    id: string;
    name: string;
    style: ITextStyle;
    comment: string | null;
}

export const DEFAULT_TEXT_STYLE: ITextStyle = {
    color: '#000000',
    fontFamily: 'Garamond',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    lineHeight: '14px',
    textAlign: 'left',
    textDecoration: 'none',
    textTransform: 'none',
};
