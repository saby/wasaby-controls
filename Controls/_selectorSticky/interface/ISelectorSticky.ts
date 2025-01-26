import { IComponentProps } from 'Controls/_interface/IComponentProps';
import { ISelectorBaseOptions } from './ISelectorBase';
import { IItemsOptions } from 'Controls/_interface/IItems';
import { Model } from 'Types/entity';
import { ISourceOptions } from 'Controls/_interface/ISource';
import { ISearchOptions } from 'Controls/_interface/ISearch';
import { TBackgroundStyle } from 'Controls/interface';
import { TemplateFunction } from 'UI/Base';
import { ReactElement } from 'react';
import { IFilterItem } from 'Controls/filter';

export interface ISelectorStickyTemplateProps
    extends IComponentProps,
        ISelectorBaseOptions,
        IItemsOptions<Model>,
        ISourceOptions,
        Pick<ISearchOptions, 'searchParam' | 'minSearchLength'> {
    selectorFactoryName?: string;
    allowAdaptive?: boolean;
    headingCaption?: string;
    headerContentTemplate?: string | TemplateFunction | ReactElement;
    breadCrumbsVisibility?: string;

    searchPlaceholder?: string;
    searchWidth?: string;

    filterDescription?: IFilterItem[];
    filterDescriptionEmptyText?: string;

    footerBackgroundStyle?: TBackgroundStyle;
    stickyFooter?: boolean;
    nodeFooterTemplate?: TemplateFunction | ReactElement;
}
