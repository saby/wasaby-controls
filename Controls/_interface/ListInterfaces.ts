import * as React from 'react';
import type { IAction, TItemActionsPosition, TItemActionsVisibility } from './IAction';
import type { TMarkerSize, TBorderStyle } from 'Controls/display';
import type { TFontWeight, TFontColorStyle } from 'Controls/interface';
import type {
    StickyVerticalPosition,
    StickyMode,
    StickyHorizontalPosition,
} from 'Controls/stickyBlock';
import { TBackgroundStyle } from './IBackgroundStyle';

/**
 * @typedef {String} Controls/interface/TVisibility
 * @description Режим видимости объекта.
 * @variant visible Виден всегда.
 * @variant hidden Спрятан всегда.
 * @variant onhover Отображается при наведении на элемент.
 * @author Колесов В.А.
 */
export type TVisibility = 'visible' | 'hidden' | 'onhover';

/**
 * @typedef {String} Controls/interface/TCursor
 * @description Тип курсора.
 * @variant pointer указатель.
 * @variant auto автоматический выбор.
 * @variant default курсор в виде стрелки.
 * @author Колесов В.А.
 */
export type TCursor = 'pointer' | 'auto' | 'default';

/**
 * @typedef {String} Controls/interface/TVAlign
 * @description Тип вертикального выравнивания.
 * @variant top сверху.
 * @variant bottom снизу.
 * @variant middle посередине.
 * @author Колесов В.А.
 */
export type TVAlign = 'top' | 'bottom' | 'middle';

/**
 * @typedef {String} Controls/interface/THAlign
 * @description Тип горизонтального выравнивания.
 * @variant left слева.
 * @variant right спрва.
 * @variant middle посередине.
 * @author Колесов В.А.
 */
export type THAlign = 'left' | 'right' | 'middle';

/**
 * Значения для обрезки текста
 * @typedef {String} TOverflow
 * @variant ellipsis Текст обрезается и добавляется многоточие
 * @variant none Текст не обрезается, но разбивается на несколько строк
 */
export type TOverflow = 'ellipsis' | 'none';

/**
 * Интерфейс опций для отображения маркера
 * @interface Controls/interfaces/ITextOverflowProps
 * @public
 */
export interface ITextOverflowProps {
    /**
     * @cfg {TOverflow} Как отображается текст, если он не умещается.
     */
    textOverflow?: TOverflow;
}

/**
 * @typedef {String} Controls/interface/TObjectFit
 * @description Тип размещения изображения.
 * @variant contain Изображение меняет свой размер, чтобы подстроиться под область внутри блока пропорционально собственным размерам. Изображение остается видимым полностью и растягивается/сжимается, ограничиваясь шириной и высотой блока.
 * @variant cover Изображение меняет свой размер, чтобы сохранять свои пропорции при заполнении блока, полностью покрыв его.
 * @variant fill Изображение меняет свой размер, чтобы заполнить всю область внутри блока: используется вся ширина и высота блока. Возможна потеря пропорции между шириной и высотой.
 * @variant none Изображение не изменяет своих размеров и никак не подстраивается под доступную область.
 * @variant scale-down Изображение меняет размер, чтобы подстроиться под область внутри блока пропорционально собственным размерам. Изображение остается видимым полностью, при необходимости, сжимается, ограничиваясь шириной и высотой блока.
 * @author Колесов В.А.
 */
export type TObjectFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

/**
 * @typedef {String} Controls/interface/TOverlayDirection
 * @description Направление градиентного перекрытия изображения для вывода текста.
 * @variant to-bottom градиент выводится на всю высоту изображения, сверху вниз.
 * @variant to-top градиент выводится на всю высоту изображения, снизу вверх.
 * @variant to-top-content градиент своей сплошной частью заполняет область текстового контента и частично перекрывает изображение выше контента.
 * @variant none нет градиентного перекрытия.
 * @author Колесов В.А.
 */
export type TOverlayDirection = 'to-bottom' | 'to-top' | 'to-top-content' | 'none';

/**
 * @typedef {String} Controls/interface/TOverlayStyle
 * @description Стиль градиентного перекрытия изображения для вывода текста.
 * @variant dark Полупрозрачный темный градиент для вывода контрастного текста на нем.
 * @variant zen Сплошной цветной градиент, использующий доминантный цвет zen-темы.
 * @author Колесов В.А.
 */
export type TOverlayStyle = 'dark' | 'zen';

/**
 * @typedef {String} Controls/interface/TVerticalPosition
 * @description Тип вертикальногоо позиционирования.
 * @variant top Сверху на всю ширину.
 * @variant top-left Сверху слева.
 * @variant top-middle Сверху поседерине.
 * @variant top-right Сверху справа.
 * @variant bottom Снизу.
 * @variant bottom-left Снизу слева.
 * @variant bottom-middle Снизу поседерине.
 * @variant bottom-right Снизу справа.
 * @author Колесов В.А.
 */
export type TVerticalPosition =
    | 'top'
    | 'top-left'
    | 'top-middle'
    | 'top-right'
    | 'bottom'
    | 'bottom-left'
    | 'bottom-middle'
    | 'bottom-right';

/**
 * @typedef {String} Controls/interface/THorizontalPosition
 * @description Тип горизонтального позиционирования.
 * @variant left слева.
 * @variant right спрва.
 * @author Колесов В.А.
 */
export type THorizontalPosition = 'left' | 'right';

/**
 * @typedef {String} Controls/interface/TCaptionPosition
 * @description Тип позиционирования заголовка.
 * @variant default Расположение по умолчанию для выбранной конфигурации. Рядом с описанием (при наличии)
 * @variant top Заголовок отображается отдельно от описания в верхней части шаблона над изображением.
 * @variant on-image Заголовок отображается отдельно от описания в верхней части шаблона поверх изображения.
 * @author Колесов В.А.
 */
export type TCaptionPosition = 'top' | 'on-image' | 'default';

/**
 * @typedef {String} Controls/interface/TProportion
 * @description Пропорции изображения (ширина:высота).
 * @variant 1:1
 * @variant 4:3
 * @variant 3:4
 * @variant 16:9
 * @author Колесов В.А.
 */
export type TProportion = '1:1' | '4:3' | '3:4' | '16:9';

/**
 * @typedef {String} Controls/interface/TImageSize
 * @description Линейка размеров изображений.
 * @variant s
 * @variant m
 * @variant l
 * @variant xlt
 * @variant xl
 * @variant 2xl
 * @variant 3xl
 * @variant 4xl
 * @variant 5xl
 * @variant 6xl
 * @variant 7xl
 * @author Колесов В.А.
 */
export type TImageSize =
    | 's'
    | 'm'
    | 'l'
    | 'xlt'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | '7xl';

/**
 * @typedef {String} Controls/interface/TSize
 * @description Общая инейка размеров. Используется для скруглений, отступов.
 * @variant null Нулевой отступ
 * @variant 3xs Минимальный отступ
 * @variant 2xs Почти минимальный отступ
 * @variant xs Очень маленький отступ
 * @variant s Маленький отступ
 * @variant m Средний отступ
 * @variant l Большой отступ
 * @variant xl Отступ xl
 * @variant 2xl Отступ 2xl
 * @variant 3xl Отступ 3xl
 * @see Controls/interface/TImageSize
 * @author Колесов В.А.
 */
export type TSize = 'null' | '3xs' | '2xs' | 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl' | '3xl';
export const AVAILABLE_SIZE_VALUES = [
    'null',
    '3xs',
    '2xs',
    'xs',
    's',
    'm',
    'l',
    'xl',
    '2xl',
    '3xl',
];

/**
 * @typedef {String} Controls/interface/TCustomContentPosition
 * @description Варианты расположения прикладных элементов.
 * @variant content - в области с заголовком и описанием.
 * @variant static - на всю ширину шаблона
 * @variant absolute - на всю ширину шаблона, поверх остального контента
 * @see Controls/interface/ICustomContent
 * @author Колесов В.А.
 */
export type TCustomContentPosition = 'content' | 'static' | 'absolute';

/**
 * Интерфейс опций для отображения чекбокса
 * @interface Controls/interface/ICheckboxProps
 * @public
 * @author Колесов В.А.
 */
export interface ICheckboxProps {
    /**
     * @cfg {Controls/interface/TVisibility} Видмость чекбокса
     */
    checkboxVisibility?: TVisibility;

    /**
     * @cfg Отображаемое значение чекбокса
     */
    checkboxValue?: true | false | null;

    /**
     * Доступность чекбокса
     */
    checkboxReadonly?: boolean;

    /**
     * Класс для позиционирования чекбокса
     */
    checkboxClassName?: string;
}

/**
 * Интерфейс опций для отображения маркера
 * @interface Controls/interface/IMarkerProps
 * @public
 * @author Колесов В.А.
 */
export interface IMarkerProps {
    /**
     * @cfg {boolean} Видимость маркера
     */
    markerVisible?: boolean;

    /**
     * @cfg {Controls/display/TMarkerSize.typedef} Размер маркера
     */
    markerSize?: TMarkerSize;

    /**
     * Класс стилей маркера
     */
    markerClassName?: string;
    /**
     * @cfg {string} Позиция маркера
     */
    markerPosition?: 'default' | 'custom';
}

/**
 * Интерфейс опций для отображения тени
 * @interface Controls/interface/IShadowProps
 * @public
 * @author Колесов В.А.
 */
export interface IShadowProps {
    /**
     * @name Controls/interface/IShadowProps#shadowVisibility
     * @cfg {Controls/interface/TVisibility} Видимость тени
     */
    shadowVisibility?: TVisibility;
    // может быть потом понадобится 'size'
}

/**
 * Интерфейс опций для отображения обводки
 * @interface Controls/interface/IBorderProps
 * @public
 * @author Колесов В.А.
 */
export interface IBorderProps {
    /**
     * @cfg {Controls/interface/TVisibility} Видимость обводки
     */
    borderVisibility?: TVisibility;

    /**
     *  @cfg {Controls/display/TBorderStyle.typedef} Стиль обводки
     */
    borderStyle?: TBorderStyle;
}

/**
 * Интерфейс опций для отображения курсора
 * @interface Controls/interface/ICursorProps
 * @public
 * @author Колесов В.А.
 */
export interface ICursorProps {
    /**
     * @cfg {Controls/interface/TCursor} Курсор, отображаемый при наведении на элемент
     */
    cursor?: TCursor;
}

/**
 * Интерфейс опций для отображения операций
 * @interface Controls/interface/IActionsProps
 * @public
 * @author Колесов В.А.
 */
export interface IActionsProps {
    /**
     * @cfg {Array<Controls/interface:IAction>} Набор операций
     */
    actions?: IAction[];

    /**
     * @cfg {Controls/interface/TVisibility} Видимость операций
     */
    actionsVisibility?: TItemActionsVisibility;

    /**
     * @cfg {boolean} Задержка появления операций
     */
    actionsDisplayDelay?: boolean;

    /**
     * @cfg {Controls/_interface/IAction/TItemActionsPosition.typedef} Позиция операций
     */
    actionsPosition?: TItemActionsPosition;

    /**
     * @cfg {React.Component | React.FunctionComponent} Шаблон для вывода операций
     */
    itemActionsTemplate?: React.Component | React.FunctionComponent;

    actionsClassName?: string;
    actionStyle?: string;
}

/**
 * Интерфейс опций для отображения скругления
 * @interface Controls/interface/IRoundAnglesProps
 * @public
 * @author Колесов В.А.
 */
export interface IRoundAnglesProps {
    /**
     * @cfg {Controls/interface/TSize} Размер скругления нижнего левого угла
     */
    roundAngleBL?: TSize;

    /**
     * @cfg {Controls/interface/TSize} Размер скругления нижнего правого угла
     */
    roundAngleBR?: TSize;

    /**
     * @cfg {Controls/interface/TSize} Размер скругления верхнего левого угла
     */
    roundAngleTL?: TSize;

    /**
     * @cfg {Controls/interface/TSize} Размер скругления верхнего правого угла
     */
    roundAngleTR?: TSize;
}

/**
 * Интерфейс опций для отображения внутренних отступов
 * @interface Controls/interface/IPaddingProps
 * @public
 * @author Колесов В.А.
 */
export interface IPaddingProps {
    /**
     * @cfg {Controls/interface/TSize} Размер верхнего внутреннего отступа
     */
    paddingTop?: TSize;

    /**
     * @cfg {Controls/interface/TSize}  Размер нижнего внутреннего отступа
     */
    paddingBottom?: TSize;

    /**
     * @cfg {Controls/interface/TSize}  Размер левого внутреннего отступа
     */
    paddingLeft?: TSize;

    /**
     * @cfg {Controls/interface/TSize}  Размер правого внутреннего отступа
     */
    paddingRight?: TSize;
}

/**
 * Интерфейс опций для отображения заголовка
 * @interface Controls/interface/ICaptionProps
 * @public
 * @author Колесов В.А.
 */
export interface ICaptionProps {
    /**
     * @cfg {string | React.ReactElement} Заголовок. В формате строки или шаблона
     */
    caption?: string | React.ReactElement;

    /**
     * @cfg {number} Количество строк заголовка
     */
    captionLines?: number;

    /**
     * @cfg {Controls/interface/TVAlign} Вертикальное выравнивание заголовка
     */
    captionVAlign?: TVAlign;

    /**
     * @cfg {Controls/interface/THAlign} Горизонтальное выравнивание заголовка
     */
    captionHAlign?: THAlign;

    /**
     * @cfg {string} Размер шрифта заголовка
     */
    captionFontSize?: string;

    /**
     * @cfg {Controls/_interface/IFontColorStyle/TFontColorStyle} Стиль шрифта заголовка
     */
    captionFontColorStyle?: TFontColorStyle;

    /**
     * @cfg {Controls/_interface/IFontColorStyle/TFontWeight} Жирность шрифта заголовка
     */
    captionFontWeight?: TFontWeight;

    /**
     * @cfg {string} Прикладной класс заголовка
     */
    captionClass?: string;
}

/**
 * Интерфейс опций для отображения описания
 * @interface Controls/interface/IDescriptionProps
 * @public
 * @author Колесов В.А.
 */
export interface IDescriptionProps {
    /**
     * @cfg {string|React.ReactElement} Описание. В формате строки или шаблона
     */
    description?: string | React.ReactElement;

    /**
     * @cfg {Number} Количество строк описания
     */
    descriptionLines?: number;

    /**
     * @cfg {Controls/interface/TVAlign} Вертикальное выравнивание описания
     */
    descriptionVAlign?: TVAlign;

    /**
     * @cfg {Controls/interface/THAlign} Горизонтальное выравнивание описания
     */
    descriptionHAlign?: THAlign;

    /**
     * @cfg {Controls/interface/TSize} Размер шрифта описания
     */
    descriptionFontSize?: TSize;

    /**
     * @cfg {Controls/_interface/IFontColorStyle/TFontColorStyle} Стиль шрифта описания
     */
    descriptionFontColorStyle?: TFontColorStyle;

    /**
     * @cfg {Controls/_interface/IFontColorStyle/TFontWeight} Жирность шрифта описания
     */
    descriptionFontWeight?: TFontWeight;

    /**
     * @cfg {string} Прикладной класс описания
     */
    descriptionClass?: string;
}

/**
 * Интерфейс опций для отображения изображения
 * @interface Controls/interface/IImageProps
 * @public
 * @author Колесов В.А.
 */
export interface IImageProps {
    /**
     * @cfg {string|Array<string>} Источник изображения
     * @remark
     * * Строка - одно изображение в подходящем формате для аттрибута src элемента <img>.
     * * Массив - несколько изображений, которые будут сформированы в image-set для использования с адаптивными разрешениями (x1, x2, x3 и т.д.).
     */
    imageSrc?: string | string[];

    /**
     * @cfg {string} Альтернативное текстовое описание изображения.
     */
    imageAlt?: string;

    /**
     * @cfg {Controls/interface/TObjectFit} Способ заполнения изображением контейнера.
     */
    imageObjectFit?: TObjectFit;

    /**
     * @cfg {string} Прикладной класс для изображения
     */
    imageClass?: string;

    /**
     * @cfg {string} Запасное изображение
     */
    fallbackImage?: string;
}

export interface ITileItemActionsProps {
    actionsPosition?: 'topRight' | 'bottomRight' | 'bottom';
}

export type TBrightness = 'dark' | 'light';

/**
 * Интерфейс опций для поддержки темы "дзен"
 * @interface Controls/interface/IZenProps
 * @public
 * @author Колесов В.А.
 */
export interface IZenProps {
    /**
     * @cfg {string} Доминантный цвет
     */
    dominantColor?: string;

    /**
     * @cfg {string} Дополнительный цвет
     */
    complementaryColor?: string;

    /**
     * @cfg {string} Тема оформления
     */
    theme?: string;

    /**
     * @cfg {Controls/interface/TBrightness} Яркость доминантного цвета
     */
    brightness?: TBrightness;
}

/**
 * Интерфейс опций для вывода прикладного контента в шаблонах
 * @interface Controls/interface/ICustomContent
 * @public
 * @author Колесов В.А.
 */
export interface ICustomContent {
    /**
     * @cfg
     * Прикладной контент, выводимый в верхней части шаблона
     */
    header?: React.Component | React.FunctionComponent;

    /**
     * @cfg
     * Расположение шаблона, переданного в header
     */
    headerPosition?: TCustomContentPosition;

    /**
     * @cfg
     * Прикладной контент, выводимый в нижней части шаблона
     */
    footer?: React.Component | React.FunctionComponent;

    /**
     * @cfg
     * Расположение шаблона, переданного в footer
     */
    footerPosition?: TCustomContentPosition;
}

/**
 * Интерфейс опций, для отображения подсказки по ховеру
 * @public
 */
export interface ITooltipProps {
    /**
     * Подсказка по ховеру
     */
    tooltip?: string;
}

export interface IStickyProps {
    stickied?: boolean;
    stickyPosition?: StickyVerticalPosition | StickyHorizontalPosition;
    stickyMode?: StickyMode;
    /**
     * Стиль фона зафиксированного при скроллировании элемента
     */
    stickiedBackgroundStyle?: TBackgroundStyle;
    // Опция для оптимизации группы прилипающих элементов,
    // позволяет задать позицию для прилипания сразу, а не после расчета.
    fixedPositionInitial?: string;
}

/**
 * Интерфейс подсветки искомого значения.
 * @public
 */
export interface IHighlightDecoratorProps {
    /**
     * Класс, используемый для подсветки элементов.
     */
    highlightDecoratorClassName: string;
    /**
     * Значение, которое необходимо подсветить.
     */
    searchValue: string;
}

/**
 * Варианты значений эффекта изображения плитки
 * @typedef {String} Controls/interface/TTileImageEffect
 * @variant none Изображение отображается без эффектов.
 * @variant light К изображению применяется эффект градиента
 * @variant custom К изображению применяется эффект градиента в зависимости от значения поля dominantColor
 * @variant border К изображению добавляется рамка. Используется для круглых изображений.
 * @see gradientColor
 */
export type TTileImageEffect = 'none' | 'light' | 'custom' | 'border';
