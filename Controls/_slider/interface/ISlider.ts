/**
 * @kaizen_zone f0953b08-a8cc-4567-9a6e-484a988c8a25
 */
import { TFontSize } from 'Controls/interface';

export interface ISliderOptions {
    borderVisible?: boolean;
    tooltipVisible?: boolean;
    scaleStep?: number;
    precision: number;
    tooltipFormatter?: Function;
    size?: string;
    direction?: string;
    tooltipPosition?: 'top' | 'bottom' | 'center';
    minValue: number;
    maxValue: number;
    scaleLabelFormatter?: Function;
    viewMode?: string;
    tooltipFontSize?: TFontSize;
    scaleFontSize?: TFontSize;
    markerVisibility?: boolean;
}
/**
 * Интерфейс для контрола Слайдер.
 *
 * @interface Controls/_slider/interface/ISlider
 * @public
 */

/*
 * Interface for the "Slider" control.
 *
 * @interface Controls/_slider/interface/ISlider
 * @public
 * @author Мочалов М.А.
 */

export interface ISlider {
    readonly '[Controls/_slider/interface/ISlider]': boolean;
}

/**
 * @name Controls/_slider/interface/ISlider#borderVisible
 * @cfg {Boolean} Устанавливает границу вокруг контрола.
 * @demo Controls-demo/Slider/Base/BorderVisible/Index
 * @demo Controls-demo/Slider/Range/BorderVisible/Index
 * @example
 * Слайдер с границей:
 * <pre class="brush:html">
 *   <Controls.slider:Base borderVisible="{{true}}" maxValue="{{100}}" minValue="{{0}}" bind:value="_value"/>
 * </pre>
 */

/**
 * @name Controls/_slider/interface/ISlider#tooltipVisible
 * @cfg {Boolean} Устанавливает подсказку при наведении на шкалу.
 * @default true
 * @demo Controls-demo/Slider/Base/TooltipVisible/Index
 * @demo Controls-demo/Slider/Range/TooltipVisible/Index
 * @example
 * Слайдер с тултипом:
 * <pre class="brush:html">
 *   <Controls.slider:Base tooltipVisible="{{true}}" maxValue="{{100}}" minValue="{{0}}" bind:value="_value"/>
 * </pre>
 */

/**
 * @name Controls/_slider/interface/ISlider#scaleStep
 * @cfg {Number} Параметр scaleStep определяет шаг шкалы, расположенной под слайдером.
 * @remark Шкала отображается, когда опция {@link borderVisible} установлена в значения false, а параметр scaleStep положительный.
 * @demo Controls-demo/Slider/Base/ScaleStep/Index
 * @demo Controls-demo/Slider/Range/ScaleStep/Index
 * @example
 * Слайдер со шкалой с шагом 20:
 * <pre class="brush:html">
 *   <Controls.slider:Base scaleStep="{{20}}" maxValue="{{100}}" minValue="{{0}}" bind:value="_value"/>
 * </pre>
 */

/**
 * @name Controls/_slider/interface/ISlider#precision
 * @cfg {Number} Количество символов в десятичной части.
 * @remark Должно быть неотрицательным.
 * @demo Controls-demo/Slider/Base/Precision/Index
 * @demo Controls-demo/Slider/Range/Precision/Index
 * @example
 * Слайдер с целыми значениями:
 * <pre class="brush:html">
 *   <Controls.slider:Base precision="{{0}}" maxValue="{{100}}" minValue="{{0}}" bind:value="_value"/>
 * </pre>
 */

/**
 * @name Controls/_slider/interface/ISlider#tooltipFormatter
 * @cfg {Function} Функция форматирования подсказки.
 * @demo Controls-demo/Slider/Base/TooltipFormatter/Index
 * @demo Controls-demo/Slider/Range/TooltipFormatter/Index
 * @remark
 * Аргументы функции:
 * <ul>
 *    <li>value - текущее положение слайдера</li>
 * </ul>
 */

/**
 * @name Controls/_slider/interface/ISlider#size
 * @cfg {String} Устанавливает размер ползунка слайдера.
 * @variant s
 * @variant m
 * @default m
 * @demo Controls-demo/Slider/Base/Size/Index
 * @demo Controls-demo/Slider/Range/Size/Index
 * @example
 * Слайдер с диаметром ползунка = 12px
 * <pre class="brush:html">
 *   <Controls.slider:Base size="s" maxValue="{{100}}" minValue="{{0}}" bind:value="_value"/>
 * </pre>
 */

/**
 * @name Controls/_slider/interface/ISlider#minValue
 * @cfg {Number} Устанавливает минимальное значение слайдера.
 * @remark Должно быть меньше, чем {@link maxValue}.
 * @demo Controls-demo/Slider/Base/LimitValues/Index
 * @example
 * Слайдер с границей:
 * <pre class="brush:html">
 *   <Controls.slider:Base minValue="{{10}}" maxValue="{{100}}" bind:value="_value"/>
 * </pre>
 * @see maxValue
 */

/**
 * @name Controls/_slider/interface/ISlider#maxValue
 * @cfg {Number} Устанавливает максимальное значение слайдера.
 * @remark Должно быть больше, чем {@link minValue}.
 * @demo Controls-demo/Slider/Base/LimitValues/Index
 * @example
 * Слайдер с границей:
 * <pre class="brush:html">
 *   <Controls.slider:Base maxValue="{{100}}" minValue="{{0}}" bind:value="_value"/>
 * </pre>
 * @see minValue
 */

/**
 * @name Controls/_slider/interface/ISlider#direction
 * @cfg {string} Определяет направление расположения слайдера.
 * @variant horizontal Горизонтальный слайдер.
 * @variant vertical Вертикальный слайдер.
 * @demo Controls-demo/Slider/Base/Direction/Index
 * @example
 * <pre class="brush:html">
 *   <Controls.slider:Base direction="vertical" maxValue="{{100}}" minValue="{{0}}" bind:value="_value"
 *   attr:class="mySliderBase_height"/>
 * </pre>
 *
 * <pre class="brush: css">
 * .mySliderBase_height {
 *    height: 200px;
 * }
 * </pre>
 */

/**
 * @name Controls/_slider/interface/ISlider#tooltipPosition
 * @cfg {string} Определяет расположения подсказки.
 * @variant top Подсказка расположена сверху.
 * @variant bottom Подсказка расположена снизу.
 * @variant center Подсказка расположена внутри маркера.
 * @demo Controls-demo/Slider/Base/TooltipPosition/Index
 * @example
 * <pre class="brush:html">
 *   <Controls.slider:Base tooltipPosition="bottom" maxValue="{{100}}" minValue="{{0}}" bind:value="_value"/>
 * </pre>
 */

/**
 * @name Controls/_slider/interface/ISlider#scaleLabelFormatter
 * @cfg {Function} Функция форматирования метки шкалы.
 * @demo Controls-demo/Slider/Base/ScaleLabelFormatter/Index
 * @remark
 * Аргументы функции:
 * <ul>
 *    <li>value - текущее положение слайдера</li>
 * </ul>
 */

/**
 * @name Controls/_slider/interface/ISlider#tooltipFontSize
 * @cfg {TFontSize} Задает размер шрифта подсказки.
 * @demo Controls-demo/Slider/Base/FontSize/Index
 * @default l
 */

/**
 * @name Controls/_slider/interface/ISlider#scaleFontSize
 * @cfg {TFontSize} Задает размер шрифта шкалы.
 * @demo Controls-demo/Slider/Base/FontSize/Index
 * @default m
 */

/**
 * @name Controls/_slider/interface/ISlider#markerVisibility
 * @cfg {boolean} Определяет видимость маркера и тултипа.
 * @demo Controls-demo/Slider/Base/markerVisibility/Index
 * @default true
 */

/**
 * @name Controls/_slider/interface/ISlider#viewMode
 * @cfg {string} Определяет внешний вид слайдера.
 * @demo Controls-demo/Slider/Base/ViewMode/Index
 * @default default
 */
