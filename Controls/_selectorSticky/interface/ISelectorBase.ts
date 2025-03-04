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
import { IExplorerOptions } from 'Controls/_explorer/interface/IExplorer';
import { IGridProps } from 'Controls/gridRender';

/**
 * Базовый интерфейс для контрола "Справочник в меню"
 * @interface Controls/selectorSticky:ISelectorBaseOptions
 * @implements Controls/interface:IComponentProps
 * @implements Controls/interface:IItems
 * @implements Controls/interface:ISource
 * @implements Controls/interface:IFilter
 * @implements Controls/interface:INavigation
 * @implements Controls/interface:IRoot
 * @implements Controls/interface:IHierarchy
 * @implements Controls/interface:IMultiSelectable
 * @implements Controls/interface:ISource
 * @implements Controls/interface:ISource
 * @implements Controls/interface:ISource
 * @implements Controls/interface:ISource
 * @implements Controls/interface:ISource
 * @implements Controls/interface:ISource
 * @implements Controls/interface:ISource
 * @public
 */
export interface ISelectorBaseOptions extends ISelectorBaseProps {
    filter?: QueryWhereExpression<unknown>;
    navigation?: INavigationOptionValue<INavigationSourceConfig>;
    root?: TKey;
    keyProperty?: string;
    /**
     * @cfg {String} Имя поля, значение которого отображается.
     */
    displayProperty?: string;
    nodeProperty?: string;
    parentProperty?: string;
    sourceController?: SourceController;
    emptyText?: string;
    emptyKey: TKey | TKey[];
    selectedKeys?: TKey[];
    excludedKeys?: TKey[];
    itemActions?: IItemAction[];
    itemPadding?: { left: string; right: string };
    expandedItems?: TKey[];
    expanderPosition?: string;
    multiSelect?: boolean;
    markerVisibility: IMarkerListOptions['markerVisibility'];
    multiSelectAccessibilityProperty: string;
    nodeFooterTemplate?: TemplateFunction | ReactElement;
    className?: string;
    allowPin?: boolean;
    historyRoot?: TKey;
    stickyFooter?: boolean;
    backgroundStyle?: TBackgroundStyle;
    footerContentTemplate?: string | TemplateFunction | ReactElement;
    footerItemData?: IFooterItemData;
    viewMode?: string;
    emptyTemplate?: TemplateFunction | ReactElement;
    groupProperty?: string;
}

interface ISelectorBaseProps
    extends IItemsOptions<Model>,
        ISourceOptions,
        Pick<IGridProps, 'getGroupProps' | 'groupRender'>,
        Pick<IExplorerOptions, 'hoverBackgroundStyle'> {}
