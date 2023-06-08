/**
 * @kaizen_zone 4f556a12-3d12-4c5d-bfd8-53e193344358
 */
import { EventUtils } from 'UI/Events';

import { Control, TemplateFunction } from 'UI/Base';
import {
    IHeading,
    IHeadingOptions,
    default as Heading,
} from 'Controls/_spoiler/Heading';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as template from 'wml!Controls/_spoiler/View/View';
import { SyntheticEvent } from 'Vdom/Vdom';
import Util from './Util';
import 'css!Controls/spoiler';

export interface IViewOptions extends IHeadingOptions {
    /**
     * @name Controls/_spoiler/IView#content
     * @cfg {String|TemplateFunction} Шаблон скрываемой области.
     * @demo Controls-demo/Spoiler/View/Content/Index
     */
    content: TemplateFunction;
    /**
     * @name Controls/_spoiler/IView#headerContentTemplate
     * @cfg {String|TemplateFunction} Контент, занимающий свободное пространство справа от заголовка. Если заголовка нет, то контент занимает все пространство шапки, в этом случае заголовок можно добавить вручную в любом месте.
     * @demo Controls-demo/Spoiler/Header/Index
     * @demo Controls-demo/Spoiler/HeaderRight/Index
     * @demo Controls-demo/Spoiler/HeadingLeft/Index
     */
    headerContentTemplate?: TemplateFunction;
}

/**
 * Интерфейс опций контрола {@link Controls/spoiler:View}.
 *
 * @public
 */
export interface IView extends IHeading {
    readonly '[Controls/_spoiler/IView]': boolean;
}

/**
 * Графический контрол, отображаемый в виде заголовка с контентной областью.
 * Предоставляет пользователю возможность управления видимостью области при нажатии на заголовок.
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_spoiler.less переменные тем оформления}
 * * {@link http://axure.tensor.ru/StandardsV8/%D1%81%D0%BF%D0%BE%D0%B9%D0%BB%D0%B5%D1%80%D1%8B_%D0%B3%D1%80%D1%83%D0%BF%D0%BF%D0%B0_%D1%81%D0%BF%D0%BE%D0%B9%D0%BB%D0%B5%D1%80%D0%BE%D0%B2.html стандарт}
 *
 * @class Controls/_spoiler/View
 * @extends UI/Base:Control
 * @implements Controls/interface:IExpandable
 * @implements Controls/spoiler:IHeading
 *
 * @public
 * @demo Controls-demo/Spoiler/View/Index
 */
class View extends Control<IViewOptions> implements IView {
    protected _notifyHandler: Function = EventUtils.tmplNotify;

    protected _template: TemplateFunction = template;
    protected _expanded: boolean = false;

    readonly '[Controls/_spoiler/IView]': boolean = true;
    readonly '[Controls/_spoiler/IHeading]': boolean = true;
    readonly '[Controls/_interface/ITooltip]': boolean = true;
    readonly '[Controls/_interface/IFontSize]': boolean = true;
    readonly '[Controls/_interface/IFontWeight]': boolean = true;
    readonly '[Controls/_interface/IFontColorStyle]': boolean = true;
    readonly '[Controls/_toggle/interface/IExpandable]': boolean = true;

    protected _beforeMount(
        options?: IViewOptions,
        contexts?: object,
        receivedState?: void
    ): void {
        this._expanded = Util._getExpanded(options, this._expanded);
    }

    protected _beforeUpdate(options?: IViewOptions, contexts?: any): void {
        this._expanded = Util._getExpanded(options, this._expanded);
    }

    private _expandedHandler(e: SyntheticEvent, state: boolean): void {
        this._notify('expandedChanged', [state]);
        this._expanded = state;
    }

    static getDefaultOptions(): Partial<IViewOptions> {
        return Heading.getDefaultOptions();
    }

    static getOptionTypes(): Partial<IViewOptions> {
        return Heading.getOptionTypes();
    }
}

export default View;

/**
 * @name Controls/_spoiler/View#headingFontSize
 * @cfg {Controls/interface:IFontSize} Размер шрифта заголовка.
 * @see Controls/spoiler:Heading#fontSize
 */
/**
 * @name Controls/_spoiler/View#headingFontWeight
 * @cfg {Controls/interface:IFontWeight} Насыщенность шрифта заголовка.
 * @see Controls/spoiler:Heading#fontWeight
 */
/**
 * @name Controls/_spoiler/View#headingFontColorStyle
 * @cfg {Controls/interface:IFontColorStyle} Стиль цвета текста и иконки заголовка.
 * @see Controls/spoiler:Heading#fontColorStyle
 */
