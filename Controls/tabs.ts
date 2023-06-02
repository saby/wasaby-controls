/**
 * @kaizen_zone f43717a4-ecb5-4bdd-a32c-4ebbcb125017
 */
/**
 * Библиотека контролов, которые служат для задания набора шаблонов, из которых в каждый момент времени может отображаться только один, с возможностью переключения между этими шаблонами.
 * @library
 * @includes ITabsTemplate Controls/_tabs/ITabsTemplate
 * @includes ITabsAdaptiveButtons Controls/_tabs/ITabsAdaptiveButtons
 * @public
 */

/*
 * tabs library
 * @library
 * @public
 * @author Мочалов М.А.
 */

export {
    default as Buttons,
    ITabsTemplate,
    ITabsTemplateOptions,
} from 'Controls/_tabs/Buttons';
export {
    default as AdaptiveButtons,
    ITabsAdaptiveButtonsOptions,
    ITabAdaptiveButtonItem,
} from 'Controls/_tabs/AdaptiveButtons';
export {
    ITabsButtons,
    ITabsButtonsOptions,
    ITabButtonItem,
} from 'Controls/_tabs/interface/ITabsButtons';
export { IBaseIcon } from 'Controls/_tabs/interface/IBaseIcon';
export { IIconCounterTabTemplate } from 'Controls/_tabs/interface/IIconCounterTabTemplate';
export { ITextCounterTabTemplate } from 'Controls/_tabs/interface/ITextCounterTabTemplate';
export { IIconTextSelectedTabTemplate } from 'Controls/_tabs/interface/IIconTextSelectedTabTemplate';

import buttonsItemTemplate = require('wml!Controls/_tabs/Buttons/ItemTemplate');
import TextCounterTabTemplate = require('wml!Controls/_tabs/Buttons/templates/TextCounterTabTemplate');
import IconCounterTabTemplate = require('wml!Controls/_tabs/Buttons/templates/IconCounterTabTemplate');
import IconTextSelectedTabTemplate = require('wml!Controls/_tabs/Buttons/templates/IconTextSelectedTabTemplate');

export {
    buttonsItemTemplate,
    TextCounterTabTemplate,
    IconCounterTabTemplate,
    IconTextSelectedTabTemplate,
};
