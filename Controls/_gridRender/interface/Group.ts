import * as React from 'react';
import { TemplateFunction } from 'UI/Base';
import {
    IAlignProps,
    IBackgroundProps,
    IFontProps,
    IIconSizeOptions,
    IIconStyleOptions,
    IStickyProps,
    ITextTransformOptions,
    TFontColorStyle,
    TFontSize,
    THorizontalAlign,
    TIconSize,
    TIconStyle,
    TSize,
    TTextTransform,
} from 'Controls/interface';
import { IRowComponentProps } from 'Controls/_gridRender/row/interface/IRowComponent';
import { ICellComponentProps } from 'Controls/_gridRender/cell/interface/ICell';
import { Model as EntityModel } from 'Types/entity';

/**
 * @typedef {String} Controls/_gridRender/group/interface/IGroupProps/TExpanderPosition
 * @description Допустимые значения для опции {@link expanderPosition}.
 * @variant left Слева от названия группы.
 * @variant right Справа от названия группы.
 */
export type TExpanderPosition = 'left' | 'right';

/**
 * Интерфейс конфигурации заголовка {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/ группы}.
 * @public
 */
export interface IGroupProps
    extends IFontProps,
        IIconSizeOptions,
        IIconStyleOptions,
        ITextTransformOptions {
    /**
     * Видимость {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/ кнопки-экспандера}.
     * @cfg
     * @default true
     * @see expanderAlign
     * @see iconSize
     */
    expanderVisible?: boolean;
    /**
     * Пользовательский шаблон, отображаемый в правой части заголовка группы.
     * @cfg
     * @default undefined
     * @markdown
     * @remark
     * В области видимости шаблона доступна переменная **item** со следующими свойствами:
     *
     * * item — идентификатор отрисовываемой группы, полученный из {@link Controls/interface/IGroupedGrid#groupProperty groupProperty}.
     * * {@link Types/collection:RecordSet#metaData metaData} — метаданные рекордсета, который загружен для таблицы.
     */
    rightTemplate?: TemplateFunction | React.ReactElement;

    /**
     * Видимость {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/visual/text/ текста заголовка группы}.
     * @cfg
     * @default true
     * @remark
     * Позволяет скрыть в заголовке группы текст вместе с кнопкой-экспандером. При использовании игнорируются {@link align} и {@link expanderVisible}
     * @see halign
     * @see expanderVisible
     */
    textVisible?: boolean;
    /**
     * Видимость {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/ горизонтальной линии}.
     * @cfg
     * @remark
     * Когда опция установлена в значение false, горизонтальная линия-разделитель будет скрыта.
     * @default true
     * @demo Controls-demo/list_new/Grouped/WithoutSeparator/Left/Index В следующем примере горизонтальная линия скрыта.
     */
    separatorVisible?: boolean;

    /**
     * Размещение {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/ кнопки-экспандера} относительно текста заголовка группы.
     * @cfg
     * @default left
     * @see expanderVisible
     * @see iconSize
     */
    expanderPosition?: TExpanderPosition;

    /**
     * Выравнивание {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/visual/text/ текста заголовка группы}.
     * @cfg
     * @default center
     */
    halign?: THorizontalAlign | string;

    /**
     * Пользовательский класс для заголовка группы
     * @cfg
     * @default center
     */
    className?: string;

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
     * Пользовательский шаблон вместо текста заголовка группы.
     * @cfg
     * @default undefined
     */
    children?: React.ReactNode;

    /**
     * Размер {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/visual/text/#font-size текста заголовка группы}.
     * @cfg
     * @default xs
     * @remark
     * Данное значение влияет на базовую линию в группе.
     * Размер шрифта задается константой из стандартного набора размеров шрифта, который определен для текущей темы оформления.
     * @see fontColorStyle
     */
    fontSize?: TFontSize;

    /**
     * Стиль цвета текста заголовка группы.
     * @cfg
     * @demo Controls-demo/breadCrumbs_new/FontColorStyle/Index
     * @remark
     * Стиль цвета текста задается константой из стандартного набора цветов, который определен для текущей темы оформления.
     * @see fontSize
     */
    fontColorStyle?: TFontColorStyle;

    /**
     * Размер иконки {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/ кнопки-экспандера}.
     * @cfg
     * @default s
     * @see iconStyle
     * @see expanderAlign
     * @see expanderVisible
     */
    iconSize?: TIconSize;

    /**
     * Стиль цвета иконки {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/ кнопки-экспандера}.
     * @cfg
     * @default default
     * @remark
     * Цвет иконки задается константой из стандартного набора цветов, который определен для текущей темы оформления.
     * @see iconSize
     * @see expanderAlign
     * @see expanderVisible
     */
    iconStyle?: TIconStyle;

    /**
     * Управляет преобразованием текста элемента в заглавные или прописные символы
     * @cfg
     * @default none
     */
    textTransform?: TTextTransform;

    backgroundStyle?: string;
    /**
     * Фон стики группы в спокойном состоянии
     */
    backgroundColorStyle?: string;
    /**
     * Фон стики группы в застиканном состоянии
     */
    fixedBackgroundStyle?: string;
}

/**
 * События мыши на группе
 * @private
 */
interface IMouseEventHandlers {
    onClick?: React.MouseEventHandler;
    onMouseEnter?: React.MouseEventHandler;
}

/**
 * Интерфейс опций компонента, который отображает заголовок {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/ группы}.
 * @private
 */
export interface IGroupComponentProps
    extends ICellComponentProps,
        IGroupProps,
        IBackgroundProps,
        IAlignProps,
        IFontProps,
        IStickyProps,
        IMouseEventHandlers {
    isContentCell?: boolean;
}

/**
 * Функция, возвращабщая свойства для ячейки заголовка группы.
 * Принимает аргумент groupId: string и возвращает {@link Controls/grid:IGroupProps}
 * @typedef TGetGroupPropsCallback
 */
export type TGetGroupPropsCallback = (groupId: string) => IGroupProps;

export interface IGroupRowComponentProps
    extends IRowComponentProps,
        IGroupProps,
        IBackgroundProps,
        IAlignProps,
        IFontProps,
        IStickyProps,
        IMouseEventHandlers {
    expanded?: boolean;
    // идентификатор в модели
    listElementName?: string;
    // Рендер области текста заголовка группы.
    textRender?: string | React.ReactElement;
    // Флаг, является ли запись первой
    isFirstItem?: boolean;
    //
    colspanGroup?: boolean;
    metaResults?: EntityModel;
}
