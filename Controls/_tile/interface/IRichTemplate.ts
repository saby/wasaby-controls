/**
 * @kaizen_zone a366fb75-0c89-4edd-9ba7-43558b9859ce
 */
import { TemplateFunction } from 'UI/Base';
import { TPaddingSize } from 'Controls/interface';
import {
    TContentPosition,
    TGradientDirection,
    TImageSize,
    TTitlePosition,
    TTitleStyle,
} from 'Controls/_tile/display/mixins/TileItem';

/**
 * @typedef {Object} ICharacteristicsItem
 * @description Элемент харастеристики для отображения на плитке.
 * @property {string} imgSrc Для задания произвольного изображения можно передать его в формате base64 или url ссылки
 * @property {String} icon Название иконки.
 * @property {String} title Подпись рядом с иконкой.
 * @property {String} tooltip Текст при наведении на характеристику.
 */
interface ICharacteristicsItem {
    imgSrc?: string;
    icon?: string;
    title?: string;
    tooltip?: string;
}

/**
 * @typedef {String} TImagePosition
 * @variant top Изображение отображается сверху.
 * @variant right Изображение отображается справа.
 * @variant bottom Изображение отображается снизу.
 * @variant left Изображение отображается слева.
 */
export type TImagePosition = 'top' | 'right' | 'bottom' | 'left';

/**
 * "Богатый" шаблон отображения элементов в {@link Controls/tile:View плитке}.
 * @class Controls/_tile/interface/IRichTemplate
 * @implements Controls/tile:IBaseItemTemplate
 * @see Controls/tile:View
 * @example
 * <pre class="brush: html; highlight: [3-11]">
 * <!-- WML -->
 * <Controls.tile:View source="{{_viewSource}}" imageProperty="image">
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/tile:RichTemplate"
 *          description="Описание"
 *          descriptionLines="5"
 *          imagePosition="top"
 *          titleLines="2"
 *          imageSize="m">
 *       </ws:partial>
 *    </ws:itemTemplate>
 * </Controls.tile:View>
 * </pre>
 * @public
 * @demo Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/Index
 * @remark
 * Высота шаблона устанавливается автоматически. Плитка вытягивается по высоте максимального элемента в строке. Опция tileHeight не учитывается.
 * Подробнее о работе с шаблоном читайте {@link /doc/platform/developmentapl/interface-development/controls/list/tile/item/rich/ здесь}.
 */

export default interface IRichTemplateOptions {
    /**
     * @typedef {String} ImageSize
     * @variant s Размер, соответствующий размеру s.
     * @variant m Размер, соответствующий размеру m.
     * @variant l Размер, соответствующий размеру l.
     * @variant 2xl Размер, соответствующий размеру изображения 2xl. Только для горизонтального расположения изображений.
     * @variant 3xl Размер, соответствующий размеру изображения 3xl. Только для горизонтального расположения изображений.
     * @variant 4xl Размер, соответствующий размеру изображения 4xl. Только для горизонтального расположения изображений.
     * @variant 5xl Размер, соответствующий размеру изображения 5xl. Только для горизонтального расположения изображений.
     * @variant 6xl Размер, соответствующий размеру изображения 6xl. Только для горизонтального расположения изображений.
     * @variant 7xl Размер, соответствующий размеру изображения 7xl. Только для горизонтального расположения изображений.
     */
    /**
     * @cfg {ImageSize} Размер изображения.
     * @remark При горизональном расположении изображений размер фото фиксированный.
     * @default s
     * @demo Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/HorizontalImageSize/Index
     * @demo Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/ImageSize/Index
     * @see imagePosition
     * @see imageViewMode
     * @see imageEffect
     */
    imageSize?: TImageSize;

    /**
     * @cfg {TImagePosition} Положение изображения.
     * @demo Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/imagePosition/Index
     * @see imageSize
     * @see imageViewMode
     * @see nodesScaleSize
     * @see imageEffect
     */
    imagePosition?: 'top' | 'right' | 'bottom' | 'left';

    /**
     * @typedef {String} TitlePosition
     * @description Варианты отображения заголовка плитки по отношению к изображению.
     * @variant underImage Заголовок отображается под изображением.
     * @variant onImage Заголовок отображается в верхней части поверх изображения.
     * @demo Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/TitlePositionOnImage/Index Демо пример показывает вариант отображения заголовка onImage
     */
    /**
     * @cfg {TitlePosition} Положение заголовка.
     * @default underImage
     */
    titlePosition?: TTitlePosition;

    /**
     * @typedef {String} ContentPosition
     * @variant underImage Контент отображается под изображением.
     * @variant onImageTop Контент отображается в верхней части поверх изображения.
     * @variant onImageBottom Контент отображается в нижней части поверх изображения.
     */
    /**
     * @cfg {ContentPosition} Положение заголовка.
     * @default underImage
     */
    contentPosition?: TContentPosition;

    /**
     * @typedef {String} ImageViewMode
     * @variant rectangle Изображение отображается в виде прямоугольника.
     * @variant circle Изображение отображается в виде круга.
     * @variant ellipse Изображение отображается в виде суперэллипса.
     * @variant none Изображение не отображается.
     */
    /**
     * @cfg {ImageViewMode} Вид отображения изображения.
     * @demo Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/ImageViewMode/Index
     * @default rectangle
     * @see imageSize
     * @see imagePosition
     * @see nodesScaleSize
     * @see imageEffect
     */
    imageViewMode?: 'rectangle' | 'circle' | 'ellipse' | 'none';

    /**
     * @typedef {String} NodesScaleSize
     * @variant s Изображение будет уменьшено на 50%.
     * @variant m Изображение будет уменьшено на 25%.
     * @variant l Изображение будет иметь оригинальный размер.
     */
    /**
     * @cfg {NodesScaleSize} Коэффициент для уменьшения высоты изображения у папок.
     * @default l
     * @see imageSize
     * @see imagePosition
     * @see imageViewMode
     * @see imageEffect
     */
    nodesScaleSize?: 's' | 'm' | 'l';

    /**
     * @typedef {String} ImageEffect
     * @variant none Изображение отображается без эффектов.
     * @variant gradient Изображение отображается с градиентом.
     * @see gradientColor
     */
    /**
     * @cfg {ImageEffect} Эффект у изображения.
     * @demo Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/ImageGradient/Index
     * @default none
     *
     * @see nodesScaleSize
     */
    imageEffect?: 'none' | 'gradient';

    /**
     * @cfg {String} Цвет градиента в месте перехода от изображения к контенту. Можно указывать в любом формате, который поддерживается в CSS.
     * @default #FFF
     * @see imageSize
     * @see imagePosition
     * @see imageViewMode
     * @see imageEffect
     */
    gradientColor?: string;

    /**
     * @typedef {String} TGradientDirection
     * @variant toBottom Направление градиента сверху вниз.
     * @variant toBottomRight Направление градиента из верхнего левого в правый нижний угол.
     */
    /**
     * @cfg {TGradientDirection} Направление градиента.
     * @default toBottom
     * @see gradientStartColor
     * @see gradientStopColor
     */
    gradientDirection?: TGradientDirection;

    /**
     * @cfg {String} Начальный цвет высокого градиента. Можно указывать в любом формате, который поддерживается в CSS.
     * @default #FFF
     * @see imageSize
     * @see imagePosition
     * @see imageViewMode
     * @see imageEffect
     * @see gradientDirection
     * @see gradientStopColor
     */
    gradientStartColor?: string;

    /**
     * @cfg {String} Конечный цвет высокого градиента. Можно указывать в любом формате, который поддерживается в CSS.
     * @default #FFF
     * @see imageSize
     * @see imagePosition
     * @see imageViewMode
     * @see imageEffect
     * @see gradientDirection
     * @see gradientStartColor
     */
    gradientStopColor?: string;

    /**
     * @cfg {Number} Количество строк в заголовке.
     * @default 1
     * @see titleColorStyle
     * @demo Controls-demo/tileNew/DifferentItemTemplates/PreviewTemplate/TitleLines/Index
     * @remark
     * Опция также работает для шаблонов {@link Controls/tile:MediumTemplate}, {@link Controls/tile:PreviewTemplate}
     */
    titleLines?: number;

    /**
     * @cfg {Controls/_interface/IFontColorStyle/TFontColorStyle.typedef} Цвет заголовка.
     * @default default
     * @see titleLines
     */
    titleColorStyle?: string;

    /**
     * @cfg {Number} Количество строк в описании.
     * @default 1
     * @see description
     */
    descriptionLines?: number;

    /**
     * @cfg {String} Текст описания.
     * @demo Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/Description/Index
     * @see descriptionLines
     */
    description?: string;

    /**
     * @cfg {TemplateFunction | String} Шаблон подвала элемента.
     */
    footerTemplate?: TemplateFunction;

    /**
     * @cfg {TemplateFunction | String} Шаблон для размещения иконки в начале строки заголовка.
     */
    beforeTitleTemplate?: TemplateFunction | string;

    /**
     * @cfg {TemplateFunction | String} Шаблон для размещения в конце строки заголовка.
     */
    afterTitleTemplate?: TemplateFunction | string;

    /**
     * @cfg {Array<ICharacteristicsItem>} Конфигурация характеристик для вывода под заголовком плитки.
     */
    characteristics?: ICharacteristicsItem[];

    /**
     * @cfg {TemplateFunction|String} Шаблон редактирования для заголовка.
     * @see descriptionEditor
     * @see footerEditor
     * @see afterImageTemplate
     */
    titleEditor?: TemplateFunction;

    /**
     * @cfg {TemplateFunction|String} Шаблон редактирования для описания.
     * @see titleEditor
     * @see footerEditor
     * @see afterImageTemplate
     */
    descriptionEditor?: TemplateFunction;

    /**
     * @cfg {TemplateFunction|String} Шаблон редактирования для подвала.
     * @see titleEditor
     * @see descriptionEditor
     * @see afterImageTemplate
     */
    footerEditor?: TemplateFunction;

    /**
     * @cfg {TemplateFunction|String} Шаблон, отображаемый после изображения и до заголовка.
     * @see titleEditor
     * @see descriptionEditor
     * @see footerEditor
     */
    afterImageTemplate?: TemplateFunction;

    /**
     * @cfg {TemplateFunction|String} Шаблон, вставляемый в углу плитки для отображения дополнительных прикладных элементов.
     * @demo Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/AdditionalPaneltemplate/Index
     * @see additionalPanelPosition
     */
    additionalPanelTemplate?: TemplateFunction;

    /**
     * @typedef {String} TAdditionalPanelPosition
     * @variant topRight Верхний правый угол.
     * @variant bottomRight Нижний правый угол.
     * @variant topLeft Верхний левый угол.
     * @variant bottomLeft Нижний левый угол.
     */
    /**
     * @cfg {TAdditionalPanelPosition} Угол, в который вставляется additionalPanelTemplate
     * @default topRight
     * @demo Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/AdditionalPaneltemplate/Index
     * @see additionalPanelTemplate
     */
    additionalPanelPosition?: string;

    /**
     * @cfg {String} Соотношение сторон изображения в формате x:y, где x-ширина, y-высота.
     * Например, для получения широкого изображения можно использовать значение 16:9.
     * @default 1:1
     *
     * @see imageSize
     */
    imageProportion?: string;

    /**
     * @cfg {String} Выравнивание контента (заголовка, описания, подвала) внутри контентной области.
     * start - выравнивание на верхнему краю
     * end - выравниваение по нижнему краю
     * @default start
     */
    justifyContent?: 'start' | 'end';

    /**
     * @cfg {TPaddingSize} Отступ от края плитки до изображения.
     * @remark
     * При установке отступа для изображений в виде прямоугольника к изображению применяется скругление углов аналогичное плитке.
     * @see imageViewMode
     */
    contentPadding?: TPaddingSize;
}
