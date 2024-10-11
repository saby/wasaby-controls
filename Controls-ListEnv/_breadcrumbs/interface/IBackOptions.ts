import { IControlOptions } from 'UI/Base';
import { TFontSize, TFontColorStyle, TIconStyle } from 'Controls/interface';
import { TBackButtonIconViewMode, TBackButtonStyle } from 'Controls/heading';
import type { ListSlice as IBrowserSlice } from 'Controls/dataFactory';

export interface IBackOptions extends IControlOptions {
    storeId: string;
    _dataOptionsValue: Record<string, IBrowserSlice>;
    fontSize?: TFontSize;
    fontColorStyle?: TFontColorStyle;
    iconStyle?: TIconStyle;
    buttonStyle?: TBackButtonStyle;
    iconViewMode?: TBackButtonIconViewMode;
    clickCallback?: Function;
}
