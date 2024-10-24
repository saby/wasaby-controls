import { ISelectorOptions } from 'Controls/dropdown';

/**
 * @implements Controls/dropdown:Selector
 * @ignoreOptions iconSize, iconStyle, fontColorStyle, validationStatus, underline
 * @public
 */
export interface IDropdownConfigArgs extends ISelectorOptions {
    caption?: string;

    /**
     * @cfg {Number} Порядок отображения меню в окне
     */
    order?: number;
}
