import { IUseFilterDescriptionOptions } from 'Controls-ListEnv/_filterBase/useFilterDescription';

export interface IFilterBase extends IUseFilterDescriptionOptions {
    alignment?: 'right' | 'left';
    emptyText?: string;

    panelTemplateName?: string;
    panelTemplateOptions?: unknown;

    detailPanelTemplateName?: string;
    detailPanelWidth?: string;
    detailPanelTopTemplateName?: string;
    detailPanelTopTemplateOptions?: object;
    detailPanelOrientation?: 'horizontal' | 'vertical';
    detailPanelExtendedItemsViewMode?: 'column' | 'row';
    detailPanelHistorySaveMode?: string;
    detailPanelExtendedTemplateName?: string;
    detailPanelEmptyHistoryTemplate?: Function | JSX.Element;
}
