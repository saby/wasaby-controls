import { ISelectorOptions } from 'Controls/dropdown';

/**
 * @mixes Controls/dropdown:IBaseSelectorOptions
 * @mixes Controls/dropdown:IGrouped
 * @mixes Controls/dropdown:IEmptyItem
 * @mixes Controls/dropdown:IHeaderTemplate
 * @mixes Controls/interface:IFilterChanged
 * @mixes Controls/interface:ISelectorDialog
 * @mixes Controls/interface:ISearch
 * @mixes Controls/dropdown:IBaseDropdown
 * @public
 */
export interface IDropdownConfigArgs extends ISelectorOptions {
    caption?: string;

    /**
     * @cfg {Number} Порядок отображения меню в окне
     */
    order?: number;
}
