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
 * Режим видимости объекта.
 * @typedef TVisibility
 * @variant visible Виден всегда.
 * @variant hidden Спрятан всегда.
 * @variant onhover Отображается при наведении на элемент.
 * @author Колесов В.А.
 */
export type TVisibility = 'visible' | 'hidden' | 'onhover';

/**
 * Тип курсора.
 * @typedef TCursor
 * @variant pointer указатель.
 * @variant auto автоматический выбор.
 * @variant default курсор в виде стрелки.
 * @author Колесов В.А.
 */
export type TCursor = 'pointer' | 'auto' | 'default';

/**
 * Тип вертикального выравнивания.
 * @typedef TVAlign
 * @variant top сверху.
 * @variant bottom снизу.
 * @variant middle посередине.
 * @author Колесов В.А.
 */
export type TVAlign = 'top' | 'bottom' | 'middle';

/**
 * Тип горизонтального выравнивания.
 * @typedef THAlign
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
 * @public
 */
export interface ITextOverflowProps {
    /**
     * Как отображается текст, если он не умещается.
     * @cfg
     */
    textOverflow?: TOverflow;
}

/**
 * Тип размещения изображения.
 * @typedef TObjectFit
 * @variant contain Изображение меняет свой размер, чтобы подстроиться под область внутри блока пропорционально собственным размерам. Изображение остается видимым полностью и растягивается/сжимается, ограничиваясь шириной и высотой блока.
 * @variant cover Изображение меняет свой размер, чтобы сохранять свои пропорции при заполнении блока, полностью покрыв его.
 * @variant fill Изображение меняет свой размер, чтобы заполнить всю область внутри блока: используется вся ширина и высота блока. Возможна потеря пропорции между шириной и высотой.
 * @variant none Изображение не изменяет своих размеров и никак не подстраивается под доступную область.
 * @variant scale-down Изображение меняет размер, чтобы подстроиться под область внутри блока пропорционально собственным размерам. Изображение остается видимым полностью, при необходимости, сжимается, ограничиваясь шириной и высотой блока.
 * @author Колесов В.А.
 */
export type TObjectFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

/**
 * Направление градиентного перекрытия изображения для вывода текста.
 * @typedef TOverlayDirection
 * @variant to-bottom градиент выводится на всю высоту изображения, сверху вниз.
 * @variant to-top градиент выводится на всю высоту изображения, снизу вверх.
 * @variant to-top-content градиент своей сплошной частью заполняет область текстового контента и частично перекрывает изображение выше контента.
 * @variant none нет градиентного перекрытия.
 * @author Колесов В.А.
 */
export type TOverlayDirection = 'to-bottom' | 'to-top' | 'to-top-content' | 'none';

/**
 * Стиль градиентного перекрытия изображения для вывода текста.
 * @typedef TOverlayStyle
 * @variant dark Полупрозрачный темный градиент для вывода контрастного текста на нем.
 * @variant zen Сплошной цветной градиент, использующий доминантный цвет zen-темы.
 * @author Колесов В.А.
 */
export type TOverlayStyle = 'dark' | 'zen';

/**
 * Тип вертикальногоо позиционирования.
 * @typedef TVerticalPosition
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
 * Тип горизонтального позиционирования.
 * @typedef THorizontalPosition
 * @variant left слева.
 * @variant right спрва.
 * @author Колесов В.А.
 */
export type THorizontalPosition = 'left' | 'right';

/**
 * Тип позиционирования заголовка.
 * @typedef TCaptionPosition
 * @variant default Расположение по умолчанию для выбранной конфигурации. Рядом с описанием (при наличии)
 * @variant top Заголовок отображается отдельно от описания в верхней части шаблона над изображением.
 * @variant on-image Заголовок отображается отдельно от описания в верхней части шаблона поверх изображения.
 * @author Колесов В.А.
 */
export type TCaptionPosition = 'top' | 'on-image' | 'default';

/**
 * Пропорции изображения (ширина:высота).
 * @typedef TProportion
 * @variant 1:1
 * @variant 4:3
 * @variant 3:4
 * @variant 16:9
 * @author Колесов В.А.
 */
export type TProportion = '1:1' | '4:3' | '3:4' | '16:9';

/**
 * Линейка размеров изображений.
 * @typedef TImageSize
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
 * Общая инейка размеров. Используется для скруглений, отступов.
 * @typedef TSize
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
 * Варианты расположения прикладных элементов.
 * @typedef TCustomContentPosition
 * @variant content - в области с заголовком и описанием.
 * @variant static - на всю ширину шаблона
 * @variant absolute - на всю ширину шаблона, поверх остального контента
 * @see Controls/interface/ICustomContent
 * @author Колесов В.А.
 */
export type TCustomContentPosition = 'content' | 'static' | 'absolute';

/**
 * @typedef TLineBrake
 * @variant all Перенос по буквам
 * @variant normal Перенос по словам
 */
export type TLineBrake = 'all' | 'normal';

/**
 * Интерфейс опций для отображения чекбокса
 * @public
 * @author Колесов В.А.
 */
export interface ICheckboxProps {
    /**
     * Видмость чекбокса
     * @cfg
     */
    checkboxVisibility?: TVisibility;

    /**
     * Отображаемое значение чекбокса
     * @cfg
     */
    checkboxValue?: true | false | null;

    /**
     * Доступность чекбокса
     * @cfg
     */
    checkboxReadonly?: boolean;

    /**
     * Класс для позиционирования чекбокса
     * @cfg
     */
    checkboxClassName?: string;
}

/**
 * Интерфейс опций для отображения маркера
 * @public
 * @author Колесов В.А.
 */
export interface IMarkerProps {
    /**
     * Видимость маркера
     * @cfg
     */
    markerVisible?: boolean;

    /**
     * Размер маркера
     * @cfg
     */
    markerSize?: TMarkerSize;

    /**
     * Класс стилей маркера
     * @cfg
     */
    markerClassName?: string;
    /**
     * Позиция маркера
     * @cfg
     */
    markerPosition?: 'default' | 'custom';
    /**
     * Позволяет отключить видимость маркера для отдельной записи списка.
     * @cfg
     */
    marker?: boolean;
}

/**
 * Интерфейс опций для отображения тени
 * @public
 * @author Колесов В.А.
 */
export interface IShadowProps {
    /**
     * Видимость тени
     * @cfg
     */
    shadowVisibility?: TVisibility;
    // может быть потом понадобится 'size'
}

/**
 * Интерфейс опций для отображения обводки
 * @public
 * @author Колесов В.А.
 */
export interface IBorderProps {
    /**
     * Видимость обводки
     * @cfg
     */
    borderVisibility?: TVisibility;

    /**
     * Стиль обводки
     * @cfg
     */
    borderStyle?: TBorderStyle;
}

/**
 * Интерфейс опций для отображения курсора
 * @public
 * @author Колесов В.А.
 */
export interface ICursorProps {
    /**
     * Курсор, отображаемый при наведении на элемент
     * @cfg
     */
    cursor?: TCursor;
}

/**
 * Интерфейс опций для отображения операций
 * @public
 * @author Колесов В.А.
 */
export interface IActionsProps {
    /**
     * Набор операций
     * @cfg
     */
    actions?: IAction[];

    /**
     * Видимость операций
     * @cfg
     */
    actionsVisibility?: TItemActionsVisibility;

    /**
     * Задержка появления операций
     * @cfg
     */
    actionsDisplayDelay?: boolean;

    /**
     * Позиция операций
     * @cfg
     */
    actionsPosition?: TItemActionsPosition;

    actionsClassName?: string;
    actionStyle?: string;
}

/**
 * Интерфейс опций для отображения скругления
 * @public
 * @author Колесов В.А.
 */
export interface IRoundAnglesProps {
    /**
     * Размер скругления нижнего левого угла
     * @cfg
     */
    roundAngleBL?: TSize;

    /**
     * Размер скругления нижнего правого угла
     * @cfg
     */
    roundAngleBR?: TSize;

    /**
     * Размер скругления верхнего левого угла
     * @cfg
     */
    roundAngleTL?: TSize;

    /**
     * Размер скругления верхнего правого угла
     * @cfg
     */
    roundAngleTR?: TSize;
}

/**
 * Интерфейс опций для отображения внутренних отступов
 * @public
 * @author Колесов В.А.
 */
export interface IPaddingProps {
    /**
     * Размер верхнего внутреннего отступа
     * @cfg
     */
    paddingTop?: TSize;

    /**
     * Размер нижнего внутреннего отступа
     * @cfg
     */
    paddingBottom?: TSize;

    /**
     * Размер левого внутреннего отступа
     * @cfg
     */
    paddingLeft?: TSize;

    /**
     * Размер правого внутреннего отступа
     * @cfg
     */
    paddingRight?: TSize;
}

/**
 * Интерфейс опций для отображения заголовка
 * @public
 * @author Колесов В.А.
 */
export interface ICaptionProps {
    /**
     * Заголовок. В формате строки или шаблона
     * @cfg
     */
    caption?: string | React.ReactElement;

    /**
     * Количество строк заголовка
     * @cfg
     */
    captionLines?: number;

    /**
     * Вертикальное выравнивание заголовка
     * @cfg
     */
    captionVAlign?: TVAlign;

    /**
     * Горизонтальное выравнивание заголовка
     * @cfg
     */
    captionHAlign?: THAlign;

    /**
     * Размер шрифта заголовка
     * @cfg
     */
    captionFontSize?: string;

    /**
     * Стиль шрифта заголовка
     * @cfg
     */
    captionFontColorStyle?: TFontColorStyle;

    /**
     * Жирность шрифта заголовка
     * @cfg
     */
    captionFontWeight?: TFontWeight;

    /**
     * Прикладной класс заголовка
     * @cfg
     */
    captionClass?: string;

    /**
     * Перенос строк заголовка
     * @cfg
     */
    captionLineBreak?: TLineBrake;
}

/**
 * Интерфейс опций для отображения описания
 * @public
 * @author Колесов В.А.
 */
export interface IDescriptionProps {
    /**
     * Описание. В формате строки или шаблона
     * @cfg
     */
    description?: string | React.ReactElement;

    /**
     * Количество строк описания
     * @cfg
     */
    descriptionLines?: number;

    /**
     * Вертикальное выравнивание описания
     * @cfg
     */
    descriptionVAlign?: TVAlign;

    /**
     * Горизонтальное выравнивание описания
     * @cfg
     */
    descriptionHAlign?: THAlign;

    /**
     * Размер шрифта описания
     * @cfg
     */
    descriptionFontSize?: TSize;

    /**
     * Стиль шрифта описания
     * @cfg
     */
    descriptionFontColorStyle?: TFontColorStyle;

    /**
     * Жирность шрифта описания
     * @cfg
     */
    descriptionFontWeight?: TFontWeight;

    /**
     * Прикладной класс описания
     * @cfg
     */
    descriptionClass?: string;
}

/**
 * Интерфейс опций для отображения изображения
 * @public
 * @author Колесов В.А.
 */
export interface IImageProps {
    /**
     * Источник изображения
     * @cfg
     * @remark
     * * Строка - одно изображение в подходящем формате для аттрибута src элемента <img>.
     * * Массив - несколько изображений, которые будут сформированы в image-set для использования с адаптивными разрешениями (x1, x2, x3 и т.д.).
     */
    imageSrc?: string | string[];

    /**
     * Альтернативное текстовое описание изображения.
     * @cfg
     */
    imageAlt?: string;

    /**
     * Способ заполнения изображением контейнера.
     * @cfg
     */
    imageObjectFit?: TObjectFit;

    /**
     * Прикладной класс для изображения
     * @cfg
     */
    imageClass?: string;

    /**
     * Запасное изображение
     * @cfg
     */
    fallbackImage?: string;
}

export interface ITileItemActionsProps {
    actionsPosition?: 'topRight' | 'bottomRight' | 'bottom';
}

export type TBrightness = 'dark' | 'light';

/**
 * Интерфейс опций для поддержки темы "дзен"
 * @public
 * @author Колесов В.А.
 */
export interface IZenProps {
    /**
     * Доминантный цвет
     * @cfg
     */
    dominantColor?: string;

    /**
     * Дополнительный цвет
     * @cfg
     */
    complementaryColor?: string;

    /**
     * Тема оформления
     * @cfg
     */
    theme?: string;

    /**
     * Яркость доминантного цвета
     * @cfg
     */
    brightness?: TBrightness;
}

/**
 * Интерфейс опций для вывода прикладного контента в шаблонах
 * @public
 * @author Колесов В.А.
 */
export interface ICustomContent {
    /**
     * Прикладной контент, выводимый в верхней части шаблона
     * @cfg
     */
    header?: React.Component | React.FunctionComponent | React.ReactNode;

    /**
     * Расположение шаблона, переданного в header
     * @cfg
     */
    headerPosition?: TCustomContentPosition;

    /**
     * Прикладной контент, выводимый в нижней части шаблона
     * @cfg
     */
    footer?: React.Component | React.FunctionComponent | React.ReactNode;

    /**
     * Расположение шаблона, переданного в footer
     * @cfg
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
     * @cfg
     */
    tooltip?: string;
}

export interface IStickyProps {
    stickied?: boolean;
    stickyPosition?: StickyVerticalPosition | StickyHorizontalPosition;
    stickyMode?: StickyMode;
    /**
     * Стиль фона зафиксированного при скроллировании элемента
     * @cfg
     */
    stickiedBackgroundStyle?: TBackgroundStyle;
    // Опция для оптимизации группы прилипающих элементов,
    // позволяет задать позицию для прилипания сразу, а не после расчета.
    fixedPositionInitial?: string;
    // Опция, позволяющая стики-заголовку установить специоальный цвет в зафиксированном состоянии
    fixedBackgroundStyle?: TBackgroundStyle;
}

/**
 * Интерфейс подсветки искомого значения.
 * @public
 */
export interface IHighlightDecoratorProps {
    /**
     * Класс, используемый для подсветки элементов.
     * @cfg
     */
    highlightDecoratorClassName: string;
    /**
     * Значение, которое необходимо подсветить.
     * @cfg
     */
    searchValue: string;
}

/**
 * Варианты значений эффекта изображения плитки
 * @typedef TTileImageEffect
 * @variant none Изображение отображается без эффектов.
 * @variant light К изображению применяется эффект градиента
 * @variant custom К изображению применяется эффект градиента в зависимости от значения поля dominantColor
 * @variant border К изображению добавляется рамка. Используется для круглых изображений.
 * @see gradientColor
 */
export type TTileImageEffect = 'none' | 'light' | 'custom' | 'border';

/**
 * Варианты расположения списочного триггера
 * @typedef TListTriggerPosition
 * @variant top Сверху
 * @variant bottom Снизу
 */
export type TListTriggerPosition = 'top' | 'bottom';

/**
 * Ориентация списочного триггера
 * @typedef TListTriggerPosition
 * @variant horizontal Горизонтальная
 * @variant vertical Вертикальная
 */
export type TListTriggerOrientation = 'horizontal' | 'vertical';
