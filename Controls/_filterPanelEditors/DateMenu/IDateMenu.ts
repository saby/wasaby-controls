import * as rk from 'i18n!Controls';
import { IEmptyItemOptions } from 'Controls/dropdown';
import { RecordSet } from 'Types/collection';
import { IRangeSelectableOptions } from 'Controls/dateRange';
import {
    IDisplayedRangesOptions,
    IFontColorStyleOptions,
    IFontSizeOptions,
    IDayTemplateOptions,
} from 'Controls/interface';
import { ICaptionOptions } from 'Controls/date';
import { IDayAvailableOptions } from 'Controls/calendar';

export const BY_PERIOD_KEY = 'byPeriod';
export const BY_PERIOD_TITLE = rk('За период');
export const ON_DATE_TITLE = rk('На дату');

/**
 * Интерфейс для меню с выбором периода.
 * @private
 */

export interface IDateMenuOptions
    extends IDayTemplateOptions,
        IFontColorStyleOptions,
        IFontSizeOptions,
        IDisplayedRangesOptions,
        ICaptionOptions,
        IDayAvailableOptions,
        IRangeSelectableOptions,
        IEmptyItemOptions {
    /**
     * @name Controls/_filterPanelEditors/DateMenu/IDateMenu#periodItemVisible
     * @cfg {Boolean} Определяет видимость пункта меню "За период".
     * @default true
     * @example
     * <pre class="brush: js">
     * this._filterSource = [ {
     *     ...,
     *     editorTemplateName: 'Controls/filterPanelEditors:DateMenu',
     *     editorOptions: {
     *         dateMenuItems: new RecordSet({
     *             rawData: [
     *                 {id: 'Today', title: 'Сегодня'},
     *                 {id: 'Week', title: 'На этой неделе'},
     *                 {id: 'Month', title: 'В этом месяце'}
     *             ],
     *             keyProperty: 'id'
     *         }),
     *         periodItemVisible: false,
     *         displayProperty: 'title',
     *         keyProperty: 'id'
     *     }
     * }];
     * </pre>
     * @demo Controls-ListEnv-demo/Filter/View/Editors/DateMenuEditor/Index
     */
    periodItemVisible?: boolean;
    propertyValue: Date | string;
    resetValue?: Date | string;
    textValue?: string;
    caption?: string;
    extendedCaption?: string;
    items?: RecordSet;
    dateMenuItems?: RecordSet;
    viewMode?: string;
    editorMode?: string;
    startValue?: Date;
    endValue?: Date;
    displayProperty: string;
    keyProperty: string;
    shouldPositionBelow?: boolean;
}
