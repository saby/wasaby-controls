import { IControlOptions } from 'UI/Base';
import { ListSlice } from 'Controls/dataFactory';
import { TKey, TFontSize, TFontColorStyle, TIconStyle } from 'Controls/interface';
import { TBackButtonIconViewMode, TBackButtonStyle } from 'Controls/heading';

export interface IBreadcrumbsViewOptions extends IControlOptions {
    storeId: string;
    _dataOptionsValue: Record<TKey, ListSlice>;
    showActionButton?: boolean;
    withoutBackButton?: boolean;
    backButtonFontSize?: TFontSize;
    fontSize?: TFontSize;
    backButtonFontColorStyle?: TFontColorStyle;
    backButtonIconStyle?: TIconStyle;
    backButtonIconViewMode?: TBackButtonIconViewMode;
    backButtonStyle?: TBackButtonStyle;
    itemClickCallback?: Function;
    arrowClickCallback?: Function;
}
