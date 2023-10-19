/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
/**
 * Вспомогательная библиотека для построения контролов, основанных на древовидном списке.
 * @library
 * @private
 */
import editingTemplate = require('wml!Controls/_listRender/Render/resources/EditInPlace/EditingTemplate');
import moneyEditingTemplate = require('wml!Controls/_listRender/Render/resources/EditInPlace/decorated/Money');
import numberEditingTemplate = require('wml!Controls/_listRender/Render/resources/EditInPlace/decorated/Number');
import itemTemplateWrapper = require('wml!Controls/_listRender/Render/resources/ItemTemplateWrapper');
import groupTemplate = require('wml!Controls/_listRender/Render/resources/GroupTemplate');
// eslint-disable-next-line deprecated-anywhere
import 'Controls/deprecatedItemActions';

export {
    default as Render,
    IRenderOptions,
    IRenderChildren,
    ISwipeEvent,
} from 'Controls/_listRender/Render';

export { default as View } from 'Controls/_listRender/View';
export {
    editingTemplate,
    moneyEditingTemplate,
    numberEditingTemplate,
    itemTemplateWrapper,
    groupTemplate,
};

import ListView = require('wml!Controls/_listRender/ListView');
export { ListView };
