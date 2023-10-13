/**
 * @kaizen_zone 9d34dedd-48d0-4181-bbcf-6dc5fd6d9b10
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import InfoboxButtonTemplate = require('wml!Controls/_popup/InfoBox/resources/InfoboxButton');
import { IIconSize, IIconSizeOptions } from 'Controls/interface';
import 'css!Controls/popup';

export interface IInfoboxButton extends IControlOptions, IIconSizeOptions {}

/**
 * Контрол, который представляет собой типовую кнопку для вызова подсказки.
 *
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_popupTemplate.less переменные тем оформления}
 *
 * @extends UI/Base:Control
 * @implements Controls/interface:IIconSize
 * @implements Controls/popup:IInfoBox
 * @implements Controls/interface:IBackgroundStyle
 * @public
 * @demo Controls-demo/InfoBox/InfoboxButtonHelp
 */

class InfoboxButton extends Control<IInfoboxButton> implements IIconSize {
    readonly '[Controls/_interface/IIconSize]': boolean;
    protected _template: TemplateFunction = InfoboxButtonTemplate;

    static getDefaultOptions(): IInfoboxButton {
        return {
            iconSize: 'm',
        };
    }
}
/**
 * @name Controls/_popup/InfoBox/InfoboxButton#iconSize
 * @cfg {String}
 * @default m
 */

export default InfoboxButton;
