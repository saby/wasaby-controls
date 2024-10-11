import { IStepOptions } from 'Controls-Wizard/IStep';
import { IControlOptions, TemplateFunction } from 'UI/Base';
import { IFontColorStyleOptions } from 'Controls/interface';
import { AreaSlice } from 'Controls-DataEnv/dataFactory';
import { RecordSet } from 'Types/collection';
import { INextButtonCaption } from 'Controls-Wizard/_vertical/INextButtonCaption';
import { IAdditionalButtonsConfig } from 'Controls-Wizard/_vertical/IAdditionalButtonsConfig';

/**
 * @typedef {String} Controls-Wizard/_vertical/ILayout/ProgressbarItemStyle
 * @variant default По умолчанию.
 * @variant success Успех
 * @variant danger Ошибка
 */
export enum PROGRESSBAR_ITEM_STYLE {
    DEFAULT = 'default',
    SUCCESS = 'success',
    DANGER = 'danger',
}

/**
 * @typedef {String} MarkerViewMode
 * @variant marker Стандартный маркер.
 * @variant arrow Вид стрелки с номером шага
 */
export enum MarkerViewMode {
    Arrow = 'arrow',
    Marker = 'marker',
}

/**
 * Допустимые свойства для конфигурации элементов {@link Controls-Wizard/vertical:ILayout#items items}.
 * @public
 * @implements Controls-Wizard/_vertical/INextButtonCaption
 */
export interface IVerticalItem<T extends Object = Object, K extends Object = Object>
    extends INextButtonCaption {
    /**
     * Заголовок шага.
     */
    title: string;
    /**
     * CSS-класс для заголовка шага
     */
    titleClassName?: string;
    /**
     * Шаблон для отображения справа от заголовка шага.
     * @demo Controls-Wizard-demo/vertical/TitleContentTemplate/Index
     */
    titleContentTemplate?: string | TemplateFunction;
    /**
     * Объект с опциями для шаблона, который отображается справа от заголовка шага.
     */
    titleContentTemplateOptions?: T;
    /**
     * Шаблон для отображения содержимого шага.
     */
    contentTemplate?: string | TemplateFunction;
    /**
     * Объект с опциями для шаблона шага.
     */
    contentTemplateOptions?: K;
    /**
     * Скрыть заголовок текущего шага.
     */
    hideCurrentTitle?: boolean;
    /**
     * Скрыть заголовок шага, когда он пройден.
     */
    hideCompletedTitle?: boolean;
    /**
     * Определяет контрастность фона по отношению к ее окружению для активного шага.
     */
    contrastBackground?: boolean;
    /**
     * Определяет контрастность фона по отношению к ее окружению для пройденного шага.
     */
    contrastBackgroundCompleted?: boolean;
    /**
     * Стиль цвета текста заголовка для пройденного шага.
     */
    titleFontColorStyleCompleted?: IFontColorStyleOptions;
    /**
     * Определяет постфикс стиля CSS-класса для настройки внешнего вида элементов.
     * Если задано значение myStyle, то на элементах будут висеть CSS классы в зависимости от состояния:
     * * Wizard-Vertical-View_step_completed_style-myStyle
     * * Wizard-Vertical-View_step_active_style-myStyle
     * * Wizard-Vertical-View_step_future_style-myStyle
     * * На заголовках:
     * * Wizard-Vertical-View_step-title_completed_style-myStyle
     * * Wizard-Vertical-View_step-title_active_style-myStyle
     * * Wizard-Vertical-View_step-title_future_style-myStyle
     */
    stepStyle?: string;
    /**
     * Стиль шага в прогрессбаре.
     * @demo Controls-Wizard-demo/vertical/progressbarVisible/Index
     * @see Controls-Wizard/_vertical/ILayout#progressbarVisible
     */
    progressbarItemStyle?: {
        future: PROGRESSBAR_ITEM_STYLE;
        current: PROGRESSBAR_ITEM_STYLE;
        completed: PROGRESSBAR_ITEM_STYLE;
    };

    /**
     * Шаблон шага
     * Рекомендуется обернуть шаблон в платформенный "Controls-Wizard/vertical:ItemTemplate"
     * В шаблон можно передать:
     *  * completedStepTemplate - шаблон контента у пройденных шагов
     *  * activeStepTemplate - шаблон контента у текущего шага
     *  * futureStepTemplate - шаблон контента у не пройденных шагов
     * @demo Controls-Wizard-demo/vertical/ItemTemplate/Index
     * @example
     * Шаблон переданные в itemTemplate:
     * <pre>
     *     <ws:partial template="Controls-Wizard/vertical:ItemTemplate" scope="{{ _options }}">
     *          <ws:completedStepTemplate>
     *              Здесь располагается контент для пройденных шагов
     *          </ws:completedStepTemplate>
     *          <ws:activeStepTemplate>
     *              Здесь располагается контент для текущего шага
     *          </ws:activeStepTemplate>
     *          <ws:futureStepTemplate>
     *              Здесь располагается контент для непройденных шагов
     *          </ws:futureStepTemplate>
     *     </ws:partial>
     * </pre>
     */
    itemTemplate?: TemplateFunction;
}

/**
 * @typedef {String} Controls-Wizard/_vertical/ILayout/MarkerSize
 * @variant s Маленький.
 * @variant m Средний.
 * @variant default По умолчанию. Размер зависит от количества шагов.
 */
export enum MARKER_SIZES {
    S = 's',
    M = 'm',
    DEFAULT = 'default',
}

/**
 * @typedef {Object} IItemBackgroundStyle
 * @description Определяет стиль фона.
 * @property {IBackgroundStyle} future Фон не пройденного шага.
 * @property {IBackgroundStyle} active Фон текущего шага.
 * @property {IBackgroundStyle} completed Фон пройденного шага.
 */

export interface ILayoutOptions extends IStepOptions, INextButtonCaption, IControlOptions {
    /**
     * @name Controls-Wizard/_vertical/ILayout#items
     * @cfg {Array.<Controls-Wizard/vertical:IVerticalItem>} Массив элементов для отображения.
     * @example
     * В данном примере показано, как задавать элементы для отображения
     * <pre class="brush: html">
     * <!-- WML -->
     * <Controls-Wizard.vertical:Layout items="{{_items}}" />
     * </pre>
     *
     * <pre class="brush: js">
     * // TypeScript
     * import {Control} from 'UI/Base';
     * ...
     * export default class MyControl extends Control<MyControlOptions> {
     *     protected _items: ReactiveObject<IVerticalItem>;
     *     ...
     *     protected _beforeMount(): void {
     *         this._items = [
     *             new ReactiveObject({
     *                 title: 'Если входящий документ',
     *                 contentTemplate: 'Controls-Wizard-demo/demoVertical2/VerticalStep1',
     *                 contentTemplateOptions: {
     *                     finishStepHandler: this.finishStepHandler,
     *                     finishWizardHandler: this.finishWizardHandler,
     *                     textInputValue: 'Лопырев договор',
     *                     finished: false
     *                 }
     *             }),
     *             new ReactiveObject({
     *                 title: 'Регистрируем как',
     *                 contentTemplate: 'Controls-Wizard-demo/demoVertical2/VerticalStep2',
     *                 contentTemplateOptions: {
     *                     finishStepHandler: this.finishStepHandler,
     *                     finishWizardHandler: this.finishWizardHandler,
     *                     stepBackHandler: this.stepBackHandler,
     *                     finished: false
     *                 }
     *             })
     *         ]
     *     }
     *     ...
     * }
     * </pre>
     * @demo Controls-Wizard-demo/demoVertical2/Vertical
     * @demo Controls-Wizard-demo/vertical/titleTemplate/Index
     */
    items: IVerticalItem[];

    /**
     * @name Controls-Wizard/_vertical/ILayout#markerSize
     * @cfg {Controls-Wizard/_vertical/ILayout/MarkerSize.typedef} Размер маркера.
     * @remark Значение по умолчанию зависит от количества элементов.
     * Если элементов меньше 10 - маркер будет иметь размер 's'. В ином случае маркер будет иметь размер 'm'
     * @default default
     *
     * @demo Controls-Wizard-demo/demoVertical2/Vertical
     * @demo Controls-Wizard-demo/vertical/default10Steps/Index
     */
    markerSize: MARKER_SIZES;

    /**
     * @name Controls-Wizard/_vertical/ILayout#progressbarVisible
     * @cfg {boolean} Видимость програссбара.
     * @default false
     *
     * @demo Controls-Wizard-demo/vertical/progressbarVisible/Index
     */
    progressbarVisible: boolean;

    /**
     * @name Controls-Wizard/_vertical/ILayout#itemBackgroundStyle
     * @cfg {IItemBackgroundStyle} Определяет стиль фона.
     * @demo Controls-Wizard-demo/vertical/backgroundStyle/Index
     * @default { active: 'default', future: 'notContrast', completed: 'default' }
     */
    itemBackgroundStyle?: {
        future?: string;
        active?: string;
        completed?: string;
    };

    /**
     * @name Controls-Wizard/_vertical/ILayout#completedStepsIndexVisible
     * @cfg {boolean} Показывать ли номера у пройденных шагов.
     * @default false
     * @demo Controls-Wizard-demo/demoVertical2/VerticalWithStack
     * @example
     * В данном примере с помощью переключателя управляем видимостью номера у пройденных шагов.
     * <pre class="brush: html">
     * <!-- WML -->
     * <Controls-Wizard.vertical:Layout completedStepsIndexVisible="{{_showCompletedSteps}}"/>
     * </pre>
     */
    completedStepsIndexVisible?: boolean;

    /**
     * @name Controls-Wizard/_vertical/ILayout#markerViewMode
     * @cfg {MarkerViewMode} Определяет внешний вид маркера.
     * @default arrow
     * @demo Controls-Wizard-demo/vertical/MarkerViewMode/Index
     * @example
     * <pre class="brush: html">
     * <!-- WML -->
     * <Controls-Wizard.vertical:Layout markerViewMode="marker"/>
     * </pre>
     */
    markerViewMode?: MarkerViewMode;

    /**
     * @name Controls-Wizard/_vertical/ILayout#leftPadding
     * @cfg {boolean} Определяет наличие отступа слева.
     * @default true
     */
    leftPadding?: boolean;

    /**
     * @name Controls-Wizard/_vertical/ILayout#mode
     * @cfg {string} Опция позволят установить режим отображения мастера.
     * @variant edit - режим редактирования.
     * @variant view - режим просмотра.
     * @remark
     * Устанавливайте данную опцию в режим "view", если все шаги в мастере пройдены.
     * @default edit
     */
    mode?: string;

    /**
     * @name Controls-Wizard/_vertical/ILayout#blockLayout
     * @cfg {boolean} Опция позволят включить или отключить блочную верстку.
     * @default true
     * @demo Controls-Wizard-demo/vertical/BlockLayout/Index
     * @example
     * В данном примере отключим блочную верстку.
     * <pre class="brush: html">
     * <!-- WML -->
     * <Controls-Wizard.vertical:Layout blockLayout="{{false}}"/>
     * </pre>
     */
    blockLayout?: boolean;

    /**
     * @name Controls-Wizard/_vertical/IWizard#blockWrapperClassName
     * @cfg {String} Класс, который будет применен к блоку с активными и пройденными шагами.
     */
    blockWrapperClassName?: string;

    _dataOptionsValue?: AreaSlice;

    /**
     * @name Controls-Wizard/_vertical/ILayout#completeButtonCaption
     * @cfg {string} Текст кнопки заврешения. Если указать данную опцию, то на последнем шаге мастера вне контентной области появится данная кнопка.
     * По нажатию на неё срабатывает событие selectedStepIndexChanged. Но в отличии от nextButtonCaption вторым аргументом приходит completed в значении true.
     * @example
     * <pre class="brush: js">
     *  <Layout onSelectedStepIndexChanged={selectedStepIndexChangedHandler} />
     *
     *  const selectedStepIndexChangedHandler = (step: number, completed: boolean) => {}
     * </pre>
     * @demo Controls-Wizard-demo/vertical/ActionButtons/Index
     */
    completeButtonCaption?: string;

    /**
     * @name Controls-Wizard/_vertical/ILayout#additionalButtonsConfig
     * @cfg {RecordSet.<Controls-Wizard/vertical:IAdditionalButtonsConfig>} Рекордсет с конфигурацией дополнительных кнопок действия.
     * @remark В десктопном режиме вертикальный мастер поддерживает наличие на одном шаге дополнительных кнопок действия больше чем 1, но в адаптиве только 1.
     * Для того чтобы отрисовать нужную вам кнопку в адаптиве необходимо:
     * @example
     * <pre class="brush: js">
     *  const buttonsConfiguration = new RecordSet<IAdditionalButtonsConfig>({
     *      keyProperty: 'step',
     *      rawData: [
     *          {
     *              step: 1,
     *              buttonsConfig: {
     *                  ...,
     *                  isAdaptive: true
     *              }
     *          }
     *      ]
     *  })
     *
     *  <Layout additionalButtonsConfig={buttonsConfiguration} />
     * </pre>
     * @demo Controls-Wizard-demo/vertical/ActionButtons/Index
     */
    additionalButtonsConfig?: RecordSet<IAdditionalButtonsConfig>;

    /**
     * @name Controls-Wizard/_vertical/IWizard#stepClickAvailable
     * @cfg {Boolean} Возможность перейти на будущий шаг кликом по заголовку шага.
     * @default true
     */
    stepClickAvailable?: boolean;

    /**
     * Controls-Wizard/_vertical/ILayout#hideUncompletedSteps
     * @cfg {Boolean} Позволяет скрыть непройденные шаги в адаптивном режиме если значение опции {@link Controls-Wizard/vertical:INextButtonCaption#nextButtonCaption nextButtonCaption} отлично от 'Далее'
     * @default false
     * @demo Controls-Wizard-demo/vertical/HideUncompletedSteps/Index
     */
    hideUncompletedSteps?: boolean;

    /**
     * Номер последнего пройденного шага.
     * @demo Controls-Wizard-demo/vertical/CurrentStepIndex/Index
     * @remark Ключевым отличием от опции selectedStepIndex является то, что selectedStepIndex определяет текущий выбранный шаг, а currentStepIndex
     * определяет последний шаг который был пройден.
     */
    currentStepIndex?: number;
}
/**
 * Интерфейс для контрола вертикального мастера настройки.
 * @interface Controls-Wizard/_vertical/ILayout
 * @public
 * @implements Controls-Wizard/_vertical/INextButtonCaption
 */
