/**
 * @kaizen_zone cf38e892-5e45-4941-98a7-87bbb1838d31
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import backTemplate = require('wml!Controls/_heading/Back/Back');
import { descriptor as EntityDescriptor } from 'Types/entity';
import 'css!Controls/heading';

import {
    IFontColorStyle,
    IFontColorStyleOptions,
    IFontSize,
    IFontSizeOptions,
    IIconStyle,
    IIconStyleOptions,
    TFontSize,
    ITextTransformOptions,
    ICaptionOptions,
} from 'Controls/interface';
import { controller as localeController } from 'I18n/i18n';

export type TBackButtonIconViewMode = 'functionalButton' | 'default';

/**
 * Интерфейс, описывающий структуру объекта конфигурации контрола {@link Controls/heading:Back}
 * @public
 */
export interface IBackOptions
    extends IControlOptions,
        IFontColorStyleOptions,
        IFontSizeOptions,
        IIconStyleOptions,
        ITextTransformOptions,
        ICaptionOptions {
    /**
     * @cfg {String} Задает режим отображения текста заголовка.
     * @variant ellipsis - Текст выводится в одну строку. Если текст целиком не помещается в отведенную область, то он обрезается и к концу строки добавляется многоточие.
     * @variant none - Текст выводится в одну строку. Если текст целиком не помещается в отведенную область, то он переносится на следующую строку.
     * @default ellipsis
     * @demo Controls-demo/Heading/Back/TextOverflow/Index
     */
    textOverflow?: 'ellipsis' | 'none';

    /**
     * @cfg {String} Задает режим отображения иконки кнопки.
     * @variant default - иконка кнопки отображается без обводки.
     * @variant functionalButton - иконка кнопки отображается с обводкой.
     * @default default
     * @demo Controls-demo/Heading/Back/IconViewMode/Index
     */
    iconViewMode?: TBackButtonIconViewMode;

    /**
     * @cfg {String | UI/Base:TemplateFunction} Шаблон, отображаемый между иконкой и заголовком кнопки
     * @see Controls/heading:IBackOptions#beforeCaptionTemplateOptions
     */
    beforeCaptionTemplate?: string | TemplateFunction;

    /**
     * @cfg {Object} Опции, которые будут переданы в шаблон, указанный в {@link Controls/heading:IBackOptions#beforeCaptionTemplate beforeCaptionTemplate}
     * @see Controls/heading:IBackOptions#beforeCaptionTemplate
     */
    beforeCaptionTemplateOptions?: object;
}

/**
 * Специализированный заголовок-кнопка для перехода на предыдущий уровень.
 * Размер иконки кнопки автоматически подстраивается под размер текста заголовка и не задается в явном виде через отдельную опцию.
 *
 * @remark
 * Может использоваться самостоятельно или в составе составных кнопок, состоящих из {@link Controls/heading:Back} и прикладной верстки.
 * Для одновременной подсветки всех частей кнопки при наведении используйте класс controls-Header_all__clickable на контейнере.
 * Кликабельность заголовка зависит от {@link readOnly режима отображения}.
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/text-and-styles/heading/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_heading.less переменные тем оформления}
 *
 *
 * @class Controls/_heading/Back
 * @extends UI/Base:Control
 * @implements Controls/interface:ICaption
 * @implements Controls/buttons:IClick
 * @implements Controls/interface:ITooltip
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IFontSize
 * @implements Controls/interface:IIconStyle
 * @implements Controls/interface:IIconStyle
 * @implements Controls/interface:ITextTransform
 * @implements Controls/heading:IBackOptions
 *
 * @public
 * @demo Controls-demo/Heading/Back/SizesAndStyles/Index
 * @demo Controls-demo/Heading/SubCaption/Index
 */

/**
 * @name Controls/_heading/Back#fontColorStyle
 * @cfg {String}
 * @variant primary
 * @variant secondary
 * @variant default
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.heading:Back caption="Back" fontColorStyle="primary"/>
 * <Controls.heading:Back caption="Back" fontColorStyle="secondary"/>
 * </pre>
 * @demo Controls-demo/Heading/Back/FontColorStyle/Index
 */

/*
 * Specialized heading to go to the previous level.
 *
 * <a href="/materials/DemoStand/app/Controls-demo%2FHeaders%2FstandartDemoHeader">Demo-example</a>.
 *
 * @class Controls/_heading/Back
 * @extends UI/Base:Control
 * @implements Controls/interface:ICaption
 * @mixes Controls/buttons:IClick
 * @implements Controls/interface:ITooltip
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IFontSize
 * @implements Controls/interface:IIconStyle
 *
 * @public
 * @author Мочалов М.А.
 * @demo Controls-demo/Heading/Back/SizesAndStyles/Index
 */

export default class Back
    extends Control<IBackOptions>
    implements IFontColorStyle, IFontSize, IIconStyle
{
    protected _template: TemplateFunction = backTemplate;

    protected _iconSize: string;
    protected _offsetSize: string;
    protected _isReverse: boolean;
    protected _stringCaption: boolean;

    readonly '[Controls/_interface/IFontSize]': boolean = true;
    readonly '[Controls/_interface/IIconStyle]': boolean = true;
    readonly '[Controls/_interface/IFontColorStyle]': boolean = true;

    protected _beforeMount(options: IBackOptions): void {
        this._updateSizes(options.fontSize, options.iconViewMode);
        this._stringCaption =
            typeof options.caption === 'string' || options.caption instanceof String;
        this._isReverse = localeController.currentLocaleConfig.directionality === 'rtl';
    }

    protected _beforeUpdate(newOptions: IBackOptions): void {
        if (this._options.fontSize !== newOptions.fontSize) {
            this._updateSizes(newOptions.fontSize, newOptions.iconViewMode);
        }
        if (this._options.caption !== newOptions.caption) {
            this._stringCaption =
                typeof newOptions.caption === 'string' || newOptions.caption instanceof String;
        }
    }

    private _updateSizes(fontSize: TFontSize, iconViewMode: TBackButtonIconViewMode): void {
        if (iconViewMode === 'functionalButton') {
            switch (fontSize) {
                case 'xs':
                case 's':
                case 'm':
                    this._iconSize = 'xs';
                    this._offsetSize = '2xs';
                    break;
                case 'l':
                case 'xl':
                case '2xl':
                case '3xl':
                    this._iconSize = 'm';
                    this._offsetSize = 'xs';
                    break;
                case '4xl':
                case '5xl':
                case '6xl':
                case '7xl':
                    this._iconSize = 'xl';
                    this._offsetSize = 'xs';
                    break;
                default:
                    this._iconSize = 'xs';
                    this._offsetSize = '2xs';
            }
        } else {
            switch (fontSize) {
                case 'xs':
                case 's':
                case 'm':
                    this._iconSize = '2xs';
                    break;
                case 'l':
                    this._iconSize = 's';
                    this._offsetSize = '3xs';
                    break;
                case 'xl':
                    this._iconSize = 'm';
                    break;
                case '2xl':
                    this._iconSize = 'm';
                    break;
                case '3xl':
                    this._iconSize = 'l';
                    break;
                case '4xl':
                    this._iconSize = 'xl';
                    break;
                case '5xl':
                    this._iconSize = '3xl';
                    break;
                case '6xl':
                    this._iconSize = '4xl';
                    break;
                case '7xl':
                    this._iconSize = '5xl';
                    break;
                default:
                    this._offsetSize = '3xs';
            }
        }
    }

    static defaultProps: IBackOptions = {
        fontSize: '3xl',
        textTransform: 'none',
        iconStyle: 'secondary',
        iconViewMode: 'default',
        textOverflow: 'ellipsis',
        fontColorStyle: 'primary',
    };

    static getOptionTypes(): object {
        return {
            fontColorStyle: EntityDescriptor(String).oneOf([
                'default',
                'primary',
                'secondary',
                'link',
                'label',
                'danger',
                'success',
                'warning',
                'unaccented',
                'info',
                'readonly',
                'contrast',
            ]),
            iconStyle: EntityDescriptor(String).oneOf([
                'default',
                'primary',
                'secondary',
                'link',
                'label',
                'danger',
                'success',
                'warning',
                'info',
                'readonly',
                'contrast',
                'unaccented',
            ]),
        };
    }
}
