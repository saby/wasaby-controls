/**
 * @kaizen_zone 772ff1d9-b53b-4f9c-86eb-a788c4cdfc36
 */
import { TemplateFunction } from 'UI/Base';
import { ILoadDataConfig } from 'Controls/dataSource';
import { TColumns } from 'Controls/grid';
import { INavigationOptionValue, INavigationSourceConfig, IItemPadding } from 'Controls/interface';
import { IStackPopupOptions } from 'Controls/popup';

export interface ISuggestListsOptions extends ILoadDataConfig {
    suggestDisplayProperty?: string;
    suggestItemTemplate?: TemplateFunction;
    searchSelectedItemTemplate?: TemplateFunction;
    suggestColumns?: TColumns;
    suggestNavigation?: INavigationOptionValue<INavigationSourceConfig>;
    suggestItemPadding?: IItemPadding;
    selectorTemplate?: {
        templateName: string;
        templateOptions: object;
        popupOptions: IStackPopupOptions;
    };
}
