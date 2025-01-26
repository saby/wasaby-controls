import { ReactElement } from 'react';
import { Model } from 'Types/entity';
import { QueryWhereExpression } from 'Types/source';
import { NewSourceController as SourceController } from 'Controls/dataSource';
import { IMarkerListOptions } from 'Controls/marker';
import {
    IItemsOptions,
    TKey,
    ISourceOptions,
    INavigationOptionValue,
    INavigationSourceConfig,
    IItemAction,
    TBackgroundStyle,
} from 'Controls/interface';
import { TemplateFunction } from 'UI/Base';
import { IFooterItemData } from 'Controls/menu';

export interface ISelectorBaseOptions extends IItemsOptions<Model>, ISourceOptions, Pick {
    filter?: QueryWhereExpression<unknown>;
    navigation?: INavigationOptionValue<INavigationSourceConfig>;
    root?: TKey;
    keyProperty?: string;
    displayProperty?: string;
    nodeProperty?: string;
    parentProperty?: string;
    sourceController?: SourceController;
    emptyText?: string;
    emptyKey: TKey;
    selectedKeys?: TKey[];
    excludedKeys?: TKey[];
    itemActions?: IItemAction[];
    itemPadding?: { left: string; right: string };
    expandedItems?: TKey[];
    expanderPosition?: string;
    multiSelect?: boolean;
    markerVisibility: IMarkerListOptions['markerVisibility'];
    multiSelectAccessibilityProperty: string;
    className?: string;
    allowPin?: boolean;
    historyRoot?: TKey;
    stickyFooter?: boolean;
    backgroundStyle?: TBackgroundStyle;
    footerContentTemplate?: string | TemplateFunction | ReactElement;
    footerItemData?: IFooterItemData;
    viewMode?: string;
    emptyTemplate?: TemplateFunction | ReactElement;
}
