import { IControlOptions } from 'UI/Base';
import { IBrowserSlice } from 'Controls-DataEnv/dataFactory';
import {
    TKey,
    TFontSize,
    TFontColorStyle,
    TIconStyle,
} from 'Controls/interface';
import { TBackButtonIconViewMode } from 'Controls/heading';

export interface IBreadcrumbsViewOptions extends IControlOptions {
    storeId: string;
    _dataOptionsValue: Record<TKey, IBrowserSlice>;
    showActionButton?: boolean;
    withoutBackButton?: boolean;
    backButtonFontSize?: TFontSize;
    backButtonFontColorStyle?: TFontColorStyle;
    backButtonIconStyle?: TIconStyle;
    backButtonIconViewMode?: TBackButtonIconViewMode;
}
