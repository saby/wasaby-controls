/**
 * @kaizen_zone f90b65ee-d3e2-41d5-9722-a2ea4200bc7e
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls/_menu/Popup/headerTemplate');
import 'css!Controls/popupTemplate';
import 'css!Controls/menu';
import 'css!Controls/CommonClasses';

/**
 * Контрол шапка меню.
 * @class Controls/menu:HeaderTemplate
 * @extends UICore/Base:Control
 * @implements Controls/interface:ICaption
 * @implements Controls/interface:IIcon
 * @implements Controls/interface:IIconSize
 * @public
 *
 */

class Header extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    static getDefaultOptions(): object {
        return {
            iconSize: 'm',
        };
    }
}

export default Header;
