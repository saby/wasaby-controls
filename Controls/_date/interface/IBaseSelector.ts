import {
    IDayTemplateOptions,
    IOpenPopup,
    IFontColorStyleOptions,
    IFontWeightOptions,
    IValidationStatusOptions,
    IDisplayedRangesOptions,
    ITooltipOptions,
    IDateConstructorOptions,
} from 'Controls/interface';
import ICaptionOptions from 'Controls/_date/interface/ICaption';
import { IDatePopupTypeOptions } from 'Controls/_date/interface/IDatePopupType';
import { IDayAvailableOptions, IShouldPositionBelowOptions } from 'Controls/calendar';

/**
 * Интерфейс для контролов, открывающих календарь из вызывающего элемента.
 * @implements Controls/interface:IDayTemplate
 * @implements Controls/interface:IOpenPopup
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IFontWeight
 * @implements Controls/interface:IValidationStatus
 * @implements Controls/interface:IDisplayedRanges
 * @implements Controls/interface:ITooltip
 * @implements Controls/interface:IDateConstructor
 * @implements Controls/date:ILinkView
 * @implements Controls/date:ICaption
 * @implements Controls/date:IDatePopupType
 * @implements Controls/calendar:IShouldPositionBelow
 * @implements Controls/calendar:IDayAvailable
 * @implements Controls/calendar:IMonthListSource
 * @public
 */
export interface IBaseSelectorOptions
    extends IDayTemplateOptions,
        IOpenPopup,
        IFontColorStyleOptions,
        IFontWeightOptions,
        IValidationStatusOptions,
        IDisplayedRangesOptions,
        ITooltipOptions,
        IDateConstructorOptions,
        ICaptionOptions,
        IDatePopupTypeOptions,
        IDayAvailableOptions,
        IShouldPositionBelowOptions {}

/**
 * @name Controls/date:IBaseSelectorOptions#fontWeight
 * @cfg {Controls/interface:TFontWeight.typedef}
 * @demo Controls-demo/dateRange/LinkView/FontWeight/Index
 * @default bold
 */

/**
 * @name Controls/date:IBaseSelectorOptions#underlineVisible
 * @cfg {Boolean} Определяет наличие подчеркивания у ссылки.
 * @default false
 */

/**
 * @name Controls/date:IBaseSelectorOptions#fontSize
 * @cfg {String} Размер шрифта.
 * @demo Controls-demo/dateRange/RangeSelector/FontSize/Index
 */
