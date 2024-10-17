import * as React from 'react';
import { TemplateFunction } from 'UI/Base';
import {
    IAlignProps,
    IBackgroundProps,
    IFontColorStyleOptions,
    IFontProps,
    IFontSizeOptions,
    IFontWeightOptions,
    IIconSizeOptions,
    IIconStyleOptions,
    IStickyProps,
    ITextTransformOptions,
    THorizontalAlign,
    TSize,
} from 'Controls/interface';
import { IRowComponentProps } from 'Controls/_gridReact/row/interface';
import { ICellComponentProps } from 'Controls/_gridReact/cell/interface';

/**
 * @typedef {String} Controls/_gridReact/group/interface/IGroupProps/TExpanderPosition
 * @description Допустимые значения для опции {@link expanderPosition}.
 * @variant left Слева от названия группы.
 * @variant right Справа от названия группы.
 */
export type TExpanderPosition = 'left' | 'right';

/**
 * Интерфейс конфигурации заголовка {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/ группы}.
 * @interface Controls/_gridReact/group/interface/IGroupProps
 * @public
 */
export interface IGroupProps
    extends IFontColorStyleOptions,
        IFontSizeOptions,
        IFontWeightOptions,
        IIconSizeOptions,
        IIconStyleOptions,
        ITextTransformOptions {
    /**
     * @name Controls/_gridReact/group/interface/IGroupProps#expanderVisible
     * @cfg {Boolean} Видимость {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/ кнопки-экспандера}.
     * @default true
     * @see expanderAlign
     * @see iconSize
     */
    expanderVisible?: boolean;
    /**
     * @name Controls/_gridReact/group/interface/IGroupProps#rightTemplate
     * @cfg {String|TemplateFunction|undefined} Пользовательский шаблон, отображаемый в правой части заголовка группы.
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
     * @name Controls/_gridReact/group/interface/IGroupProps#textVisible
     * @cfg {Boolean} Видимость {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/visual/text/ текста заголовка группы}.
     * @default true
     * @remark
     * Позволяет скрыть в заголовке группы текст вместе с кнопкой-экспандером. При использовании игнорируются {@link align} и {@link expanderVisible}
     * @see halign
     * @see expanderVisible
     */
    textVisible?: boolean;
    backgroundStyle?: string;
    /**
     * @name Controls/_gridReact/group/interface/IGroupProps#separatorVisible
     * @cfg {Boolean} Видимость {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/ горизонтальной линии}.
     * @remark
     * Когда опция установлена в значение false, горизонтальная линия-разделитель будет скрыта.
     * @default true
     * @demo Controls-demo/list_new/Grouped/WithoutSeparator/Left/Index В следующем примере горизонтальная линия скрыта.
     */
    separatorVisible?: boolean;

    /**
     * @name Controls/_gridReact/group/interface/IGroupProps#expanderPosition
     * @cfg {Controls/_gridReact/group/interface/IGroupProps/TExpanderPosition.typedef} Размещение {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/ кнопки-экспандера} относительно текста заголовка группы.
     * @default left
     * @see expanderVisible
     * @see iconSize
     */
    expanderPosition?: TExpanderPosition;

    /**
     * @name Controls/_gridReact/group/interface/IGroupProps#halign
     * @cfg {Controls/interface:THorizontalAlign} Выравнивание {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/visual/text/ текста заголовка группы}.
     * @default center
     */
    halign?: THorizontalAlign;

    /**
     * @name Controls/_gridReact/group/interface/IGroupProps#className
     * @text Пользовательский класс для заголовка группы
     * @default center
     */
    className?: string;

    /**
     * @name Controls/_gridReact/group/interface/IGroupProps#paddingTop
     * @cfg {Controls/interface/TSize.typedef} Размер верхнего внутреннего отступа
     */
    paddingTop?: TSize;

    /**
     * @name Controls/_gridReact/group/interface/IGroupProps#paddingBottom
     * @cfg {Controls/interface/TSize.typedef} Размер нижнего внутреннего отступа
     */
    paddingBottom?: TSize;
}

/**
 * @name Controls/_gridReact/group/interface/IGroupProps#children
 * @cfg {String|TemplateFunction|undefined} Пользовательский шаблон вместо текста заголовка группы.
 * @default undefined
 * @see fontSize
 */
/**
 * @name Controls/_gridReact/group/interface/IGroupProps#fontSize
 * @cfg {Controls/_interface/IFontSize/TFontSize.typedef} Размер {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/visual/text/#font-size текста заголовка группы}.
 * @default xs
 * @remark
 * Данное значение влияет на базовую линию в группе.
 * Размер шрифта задается константой из стандартного набора размеров шрифта, который определен для текущей темы оформления.
 * @see halign
 */
/**
 * @name Controls/_interface/IBaseGroupTemplate#fontColorStyle
 * @cfg {Controls/_interface/IFontColorStyle/TFontColorStyle.typedef} Стиль цвета текста заголовка группы.
 * @demo Controls-demo/breadCrumbs_new/FontColorStyle/Index
 * @remark
 * Стиль цвета текста задается константой из стандартного набора цветов, который определен для текущей темы оформления.
 */
/**
 * @name Controls/_gridReact/group/interface/IGroupProps#iconSize
 * @cfg {Controls/_interface/IIconSize/TIconSize.typedef} Размер иконки {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/ кнопки-экспандера}.
 * @default s
 * @see iconStyle
 * @see expanderAlign
 * @see expanderVisible
 */
/**
 * @name Controls/_gridReact/group/interface/IGroupProps#iconStyle
 * @cfg {Controls/_interface/IIconStyle/TIconStyle.typedef} Стиль цвета иконки {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/ кнопки-экспандера}.
 * @default default
 * @remark
 * Цвет иконки задается константой из стандартного набора цветов, который определен для текущей темы оформления.
 * @see iconSize
 * @see expanderAlign
 * @see expanderVisible
 */
/**
 * @name Controls/_gridReact/group/interface/IGroupProps#fontWeight
 * @cfg {String} Насыщенность шрифта.
 * @default default
 */

/**
 * @name Controls/_gridReact/group/interface/IGroupProps#textTransform
 * @cfg {Controls/_interface/ITextTransform/TTextTransform.typedef} Управляет преобразованием текста элемента в заглавные или прописные символы
 * @default none
 */

/**
 * @interface Controls/_gridReact/group/interface/IMouseEventHandlers
 * @private
 */
interface IMouseEventHandlers {
    onClick?: React.MouseEventHandler;
    onMouseEnter?: React.MouseEventHandler;
}

/**
 * Интерфейс опций компонента, который отображает заголовок {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/ группы}.
 * @interface Controls/_gridReact/group/interface/IGroupComponentProps
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
 *
 * Принимает аргумент groupId: string и возвращает {@link Controls/gridReact:IGroupProps}
 * @typedef {Function} Controls/_gridReact/group/interface/TGetGroupPropsCallback
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
    groupRender?: React.ReactElement;

    expanded?: boolean;
    // идентификатор в модели
    listElementName?: string;
    // Рендер области текста заголовка группы.
    textRender?: string | React.ReactElement;
    // Флаг, является ли запись первой
    isFirstItem?: boolean;
    //
    colspanGroup?: boolean;
}
