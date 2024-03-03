/**
 * @kaizen_zone 9b624d5d-133f-4f58-8c48-7fb841857d9e
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_popupTemplate/Stack/Template/Stack/Stack';
import * as rk from 'i18n!Controls';
import {
    Controller as ManagerController,
    getAdaptiveDesktopMode,
    IAdaptivePopupOptions,
} from 'Controls/popup';
import {
    default as IPopupTemplate,
    IPopupTemplateOptions,
} from 'Controls/_popupTemplate/interface/IPopupTemplate';
import { IBaseStackTemplateOptions } from 'Controls/_popupTemplate/Stack/Template/BaseStack';
import { unsafe_getRootAdaptiveMode } from 'UI/Adaptive';
import 'css!Controls/popupTemplate';

/**
 * @typedef {Object} Controls/_popupTemplate/Stack/RightPanelOptions
 * @property {Array.<Hint/interface:IHelpButtonConfig>} helpButtonConfig Конфигурация кнопки помощи.
 * @property {String} entityId Идентификатор stack-панели или вкладки в stack-панели, имеет вид "entity-<идентификатор>". Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/extends/help-system/routes/#2-stack-stack- здесь}.
 * @property {String} title Заголовок stack-панели или вкладки в stack-панели. Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/extends/help-system/routes/#2-stack-stack- здесь}.
 *
 */
export interface IRightPanelOptions {
    helpButtonConfig: object[];
    entityId?: string;
    title?: string;
}

export interface IStackTemplateOptions
    extends IControlOptions,
        IPopupTemplateOptions,
        IBaseStackTemplateOptions,
        IAdaptivePopupOptions {
    headerBackgroundStyle?: string;
    footerBackgroundStyle?: string;
    backgroundStyle?: string;
    maximizeButtonVisibility?: boolean;
    workspaceWidth?: number;
    headerBorderVisible?: boolean;
    rightBorderVisible?: boolean;
    maximized?: boolean;
    maxWidth?: number;
    minWidth?: number;
    stackMinimizedWidth?: number;
    width?: number;
    rightPanelOptions?: IRightPanelOptions;
    toolbarContentTemplate?: Function | string;
}

const MINIMIZED_STEP_FOR_MAXIMIZED_BUTTON = 100;

/**
 * Базовый шаблон {@link /doc/platform/developmentapl/interface-development/controls/openers/stack/ стекового окна}.
 *
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/openers/stack/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_popupTemplate.less переменные тем оформления}
 *
 * @class Controls/_popupTemplate/Stack
 * @extends UI/Base:Control
 *
 * @public
 * @implements Controls/popupTemplate:IPopupTemplate
 * @implements Controls/popupTemplate:IPopupTemplateBase
 * @implements Controls/popup:IAdaptivePopup
 * @demo Controls-demo/PopupTemplate/Stack/HeaderBorderVisible/Index
 * @demo Controls-demo/PopupTemplate/Stack/DoubleSideContent/Index
 */

class StackTemplate extends Control<IStackTemplateOptions> implements IPopupTemplate {
    '[Controls/_popupTemplate/interface/IPopupTemplate]': boolean = true;
    protected _template: TemplateFunction = template;
    protected _maximizeButtonTitle: string;
    protected _maximizeButtonVisibility: boolean = false;
    protected _hasRightPanel: boolean;
    protected _slidingPanelOptions: {} = {
        height: '100%',
        position: 'bottom',
        desktopMode: 'stack',
    };
    protected _adaptiveWidth: number;
    protected _allowAdaptive: boolean;

    protected _isAdaptive: boolean = unsafe_getRootAdaptiveMode().device.isPhone();

    protected _rightBottomTemplate: string;
    private _maximizeButtonClickCallback: () => void;

    protected _beforeMount(options: IStackTemplateOptions): void {
        // В теории, приложение может неправильно определить устройство и выставить isAdaptive=true на десктопе,
        // в таком случае стек будет строить шторку, а шторка стек, из-за чего произайдет бесконечный цикл.
        // На этот случай поставим дополнительную проверку.
        this._allowAdaptive = options.isAdaptive && this._isAdaptive;
        if (options.adaptiveOptions?.viewMode) {
            const desktopMode = getAdaptiveDesktopMode(options.adaptiveOptions?.viewMode, 'stack');
            this._slidingPanelOptions.desktopMode = desktopMode;
        }
        if (this._isAdaptive) {
            // На случай если не задали ширины, возьмем среднюю ширину попапов на сайте.
            const standardWidth = 700;
            this._adaptiveWidth =
                options.width || options.minWidth || options.maxWidth || standardWidth;
        }
        this._maximizeButtonTitle = `${rk('Свернуть', 'окно')}/${rk('Развернуть', 'окно')}`;
        this._hasRightPanel = ManagerController.hasRightPanel() || !!options.toolbarContentTemplate;
        this._updateMaximizeButton(options);
        this._maximizeButtonClickCallback = this.changeMaximizedState.bind(this);
        this._rightBottomTemplate = ManagerController.getRightPanelBottomTemplate();
        this._getTemplateName = this._getTemplateName.bind(this);
    }

    protected _beforeUpdate(options: IStackTemplateOptions): void {
        this._updateMaximizeButton(options);
    }

    protected _afterUpdate(oldOptions: IStackTemplateOptions): void {
        if (this._options.maximized !== oldOptions.maximized) {
            this._notify('controlResize', [], { bubbling: true });
        }
    }

    protected _getBackgroundColor(backgroundStyle: string): string {
        return backgroundStyle === 'default'
            ? 'controls-StackTemplate_backgroundColor'
            : 'controls-background-' + backgroundStyle;
    }

    protected _getFooterBackgroundColor(backgroundStyle: string): string {
        return backgroundStyle === 'default'
            ? 'controls-StackTemplate__bottomArea-backgroundColor'
            : 'controls-background-' + backgroundStyle;
    }

    protected close(): void {
        this._notify('close', [], { bubbling: true });
    }

    private _updateMaximizeButton(options: IStackTemplateOptions): void {
        if (options.maxWidth - options.minWidth < MINIMIZED_STEP_FOR_MAXIMIZED_BUTTON) {
            this._maximizeButtonVisibility = false;
        } else {
            this._maximizeButtonVisibility = options.maximizeButtonVisibility;
        }
    }

    // Для пользователей делается механизм подсказок, который должен быть привязан к определенному шаблону на
    // сайте. На уровне StackTemplate мы не знаем в каком шаблоне находимся и не можем передать это в контроллер
    // подсказок. Передадим метод, который по DOM определит имя шаблона. Другого способа узнать имя шаблона окна пока
    // нет, оставим поддержку полукостыля на нашем уровне.
    protected _getTemplateName(): string {
        const popupContainer = this._container.closest('.controls-Popup');
        return popupContainer ? popupContainer.getAttribute('templateName') : '';
    }

    toggleMaximizeState(maximized?: boolean): void {
        /**
         * @event maximized
         * Occurs when you click the expand / collapse button of the panels.
         */
        this._notify('maximized', [maximized], { bubbling: true });
    }

    protected changeMaximizedState(): void {
        this.toggleMaximizeState();
    }

    static getDefaultOptions(): IStackTemplateOptions {
        return {
            headingFontSize: '4xl',
            backgroundStyle: 'default',
            headingFontColorStyle: 'default',
            closeButtonVisible: true,
            closeButtonViewMode: 'toolButton',
            headerBorderVisible: true,
            rightBorderVisible: true,
        };
    }
}

/**
 * @name Controls/_popupTemplate/Stack#headerBackgroundStyle
 * @cfg {String} Определяет цвет фона шапки стекового окна.
 * @variant default
 * @variant unaccented
 * @variant secondary
 * @variant primary
 * @variant danger
 * @variant warning
 * @variant success
 * @variant info
 * @variant contrast
 * @default unaccented
 * @demo Controls-demo/PopupTemplate/Stack/backgroundStyle/Index
 */

/**
 * @name Controls/_popupTemplate/Stack#footerBackgroundStyle
 * @cfg {String} Определяет цвет фона футера стекового окна.
 * @variant default
 * @variant unaccented
 * @variant secondary
 * @variant primary
 * @variant danger
 * @variant warning
 * @variant success
 * @variant info
 * @variant contrast
 * @default default
 * @demo Controls-demo/PopupTemplate/Stack/FooterBackgroundStyle/Index
 */

/**
 * @name Controls/_popupTemplate/Stack#backgroundStyle
 * @cfg {String} Определяет цвет фона стекового окна.
 * @variant default
 * @variant unaccented
 * @variant secondary
 * @variant primary
 * @variant danger
 * @variant warning
 * @variant success
 * @variant info
 * @variant contrast
 * @default default
 * @demo Controls-demo/PopupTemplate/Stack/backgroundStyle/Index
 */

/**
 * @name Controls/_popupTemplate/Stack#bodyContentTemplate
 * @cfg {function|String} Основной контент шаблона, располагается под headerContentTemplate.
 */

/**
 * @name Controls/_popupTemplate/Stack#toolbarContentTemplate
 * @cfg {function|String} Шаблон контента под крестиком закрытия для размещения тулбара, расположенного в правой панели.
 */

/**
 * @name Controls/_popupTemplate/Stack#leftContentTemplate
 * @cfg {function|String} Шаблон контента слева границы стекового окна.
 */

/**
 * @name Controls/_popupTemplate/Stack#maximizeButtonVisibility
 * @cfg {Boolean} Определяет, будет ли отображаться кнопка изменения размера.
 * @default false
 */

/**
 * @name Controls/_popupTemplate/Stack#headerBorderVisible
 * @cfg {Boolean} Определяет, будет ли отображаться граница шапки панели.
 * @default true
 * @remark
 * Позволяет скрыть отображение нижней границы {@link Controls/popupTemplate:IPopupTemplateBase#headerContentTemplate headerContentTemplate}. Используется для построения двухуровневых шапок.
 * Необходимо поместить свой контейнер с шапкой в {@link Controls/popupTemplate:IPopupTemplateBase#bodyContentTemplate bodyContentTemplate} и навесить:
 *
 * 1. класс, добавляющий фон для шапки:
 * <pre class="brush: css">
 * controls-StackTemplate__top-area_default
 * </pre>
 * 2. класс, добавляющий нижнюю границу для шапки:
 * <pre class="brush: css">
 * controls-StackTemplate__top-area-border
 * </pre>
 * @demo Controls-demo/PopupTemplate/Stack/HeaderBorderVisible/Index
 */

/**
 * @name Controls/_popupTemplate/Stack#rightBorderVisible
 * @cfg {Boolean} Определяет, будет ли отображаться полоса разделяющая правую панель и контент.
 * @default true
 * @remark
 * Позволяет скрыть отображение правой границы.
 * @demo Controls-demo/PopupTemplate/Stack/RightBorderVisible/Index
 */

/**
 * @name Controls/_popupTemplate/Stack#workspaceWidth
 * @cfg {Number} Текущая ширина шаблона стековой панели
 * @remark
 * Опция только для чтения, значение устанавливается контролом Controls/popup исходя из заданной конфигурации окна
 */

/**
 * @name Controls/_popupTemplate/Stack#rightPanelOptions
 * @cfg {Controls/_popupTemplate/Stack/RightPanelOptions.typedef} Опции для шаблона правой панели стекового окна.
 * @example
 * Работает только в том случае, если был указан rightPanelBottomTemplate, указать его можно следующим образом:
 * <pre>
 *   import {ManagerController} from 'Controls/popup';
 *   ...
 *   ManagerController.setRightPanelBottomTemplate('Ваш шаблон');
 * </pre>
 * @see Hint/interface:IHelpButtonItem
 */

/**
 * @name Controls/_popupTemplate/Stack#stackPosition
 * @cfg {string} Положение стекового окна
 * @variant left окно будет прижато к левому краю
 * @variant right окно будет прижато к правому краю страницы
 * @default right
 * @demo Controls-demo/Popup/Stack/StackPosition/Index
 */

/**
 * @name Controls/_popupTemplate/Stack#toggleMaximizeState
 * @function
 * @description Переключает состояние разворота панели.
 * @param {Boolean} maximize Определяет новое состояние разворота панели. Если аргумент не передан, то новое состояние задается противоположным текущему.
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <ws:template name="StackTemplate">
 *  <Controls.popupTemplate:Stack name="my_stack">
 *      <ws:bodyContentTemplate>
 *          <Controls.input:Text value="_value" />
 *          <Controls.buttons:Button caption="maximized" on:click="_maximized()"/>
 *      </ws:bodyContentTemplate>
 *  </Controls.popupTemplate:Stack>
 * </ws:template>
 *
 * <Controls.popup:Stack name="stack" template="StackTemplate"/>
 *
 * </pre>
 * <pre class="brush: js">
 * // JavaScript
 * class MyControl extends Control<IControlOptions>{
 *    ...
 *
 *    _beforeMount() {
 *      var popupOptions = {
 *          autofocus: true
 *      }
 *      this._children.stack.open(popupOptions)
 *    }
 *
 *    _maximized() {
 *       this._children.my_stack.toggleMaximizeState()
 *    }
 *
 *    ...
 * }
 * </pre>
 */

/**
 * @event Событие, позволяющее растянуть стэковое окно на полный экран.
 * @name Controls/_popupTemplate/Stack#fullscreen
 * @param {boolean} fullscreen
 * @demo Controls-demo/Popup/Stack/Fullscreen/Index
 */

export default StackTemplate;
