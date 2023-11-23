import { IControlOptions } from 'UI/Base';
import { IBrowserSlice } from 'Controls/dataFactory';
import { TKey, TFontSize, TFontColorStyle, TIconStyle } from 'Controls/interface';
import { TBackButtonIconViewMode } from 'Controls/heading';

export interface IBackOptions extends IControlOptions {
    storeId: string;
    _dataOptionsValue: Record<TKey, IBrowserSlice>;
    fontSize?: TFontSize;
    fontColorStyle?: TFontColorStyle;
    iconStyle?: TIconStyle;
    iconViewMode?: TBackButtonIconViewMode;
    clickCallback?: Function;
}
