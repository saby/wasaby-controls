/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
import { TemplateFunction } from 'UI/Base';

/**
 * @typedef {String} ImageFit Режим встраивания изображения
 * @variant none Изображение вставляется в центр плитки и отображается "как есть"
 * @variant cover Изображение будет подстраиваться под размеры плитки так, чтобы заполнить всю область плитки.
 * @variant contain Изображение полностью помещается в контейнер плитки без обрезания и масштабирования.
 */
export type TImageFit = 'none' | 'cover' | 'contain';

/**
 * @typedef {String} TImageEffect Варианты значений эффекта изображения
 * @variant none Изображение отображается без эффектов.
 * @variant gradient Изображение отображается с градиентом.
 * @see gradientColor
 */
export type TImageEffect = 'none' | 'gradient';

/**
 * @typedef {String} TImageViewMode Варианты значений режима вывода изображения
 * @variant rectangle Изображение отображается в виде прямоугольника.
 * @variant circle Изображение отображается в виде круга.
 * @variant ellipse Изображение отображается в виде суперэллипса.
 * @variant none Изображение не отображается.
 */
export type TImageViewMode = 'rectangle' | 'circle' | 'ellipse' | 'none';

/**
 * @typedef {String} TImagePosition Варианты значений позиции изображения
 * @variant top Изображение отображается сверху.
 * @variant right Изображение отображается справа.
 * @variant bottom Изображение отображается снизу.
 * @variant left Изображение отображается слева.
 */
export type TImagePosition = 'top' | 'right' | 'bottom' | 'left';

/**
 * @typedef {String} TImageSize Варианты значений размера изображения
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
export type TImageSize = 's' | 'm' | 'l' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';

/**
 * Интерфейс записи, у которой есть изображение
 * @public
 */
export default interface IItemImage {
    /**
     * Размер изображения.
     * @remark При горизональном расположении изображений размер фото фиксированный.
     * @default s
     * @demo Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/HorizontalImageSize/Index
     * @see imagePosition
     * @see imageViewMode
     * @see imageEffect
     */
    imageSize?: TImageSize;

    /**
     * Положение изображения.
     * @see imageSize
     * @see imageViewMode
     * @see nodesScaleSize
     * @see imageEffect
     */
    imagePosition?: TImagePosition;

    /**
     * Режим вывода изображения.
     * @default rectangle
     * @see imageSize
     * @see imagePosition
     * @see nodesScaleSize
     * @see imageEffect
     */
    imageViewMode?: TImageViewMode;

    /**
     * Эффект у изображения.
     * @default none
     * @see nodesScaleSize
     */
    imageEffect?: TImageEffect;

    /**
     * Соотношение сторон изображения в формате x:y, где x-ширина, y-высота.
     * Например, для получения широкого изображения можно использовать значение 16:9.
     * @default 1:1
     * @see imageSize
     */
    imageProportion?: string;

    /**
     * Шаблон, отображаемый после изображения.
     * @see titleEditor
     * @see descriptionEditor
     * @see footerEditor
     */
    afterImageTemplate?: TemplateFunction | string;
}
