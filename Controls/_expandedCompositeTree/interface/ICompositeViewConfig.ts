import * as React from 'react';
import { TemplateFunction } from 'UI/Base';
import { ITreeTileCollectionOptions } from 'Controls/treeTile';
import { IItemActionsOptions } from 'Controls/itemActions';
import { IHierarchyOptions, IItemPadding, IRoundBorder, ISourceOptions } from 'Controls/interface';
import { IColumnConfig, IHeaderConfig } from 'Controls/grid';

/**
 * Режим отображения смешанного списка
 * @variant tile Плитка
 * @variant tree Таблица
 * @typedef TCompositeViewMode
 */
export type TCompositeViewMode = 'tile' | 'table';

// region tile options

/**
 * Варианты значений для tileMode
 * @typedef TTileMode
 * @variant static Отображается плитка с фиксированной шириной.
 * @variant dynamic Отображается плитка с динамической шириной.
 */
export type TTileMode = 'static' | 'dynamic' | string;

/**
 * Типы значений для tileSize
 * @typedef TTileSize
 * @variant s
 * @variant m
 * @variant l
 */
export type TTileSize = 's' | 'm' | 'l' | string;

/**
 * Варианты ориентации плитки
 * @typedef TTileOrientation
 * @variant horizontal
 * @variant vertical
 */
export type TTileOrientation = 'horizontal' | 'vertical';

/**
 * Интерфейс минимальных настроек контрола плитки
 * @public
 */
export interface ITileConfig {
    /**
     * Режим отображения плитки с динамической/фиксированной шириной.
     * @cfg
     * @see imageHeightProperty
     * @see imageWidthProperty
     * @remark Для автоматического расчета ширины элемента нужно указать оригинальные размеры изображения.
     *
     * Полезные ссылки:
     * * {@link /doc/platform/developmentapl/interface-development/controls/list/tile/view/width/ руководство разработчика}
     * @example
     * В следующем примере показано, как отобразить плитку с динамической шириной.
     * <pre class="brush: html; highlight: [9]">
     * <!-- WML -->
     * <Controls.tile:View
     *    source="{{_viewSource}}"
     *    keyProperty="id"
     *    parentProperty="Раздел"
     *    imageWidthProperty="imageWidth"
     *    imageHeightProperty="imageHeight"
     *    nodeProperty="Раздел@"
     *    tileMode="dynamic">
     *    <ws:itemTemplate>
     *       ...
     *    </ws:itemTemplate>
     * </Controls.tile:View>
     * </pre>
     * @demo Controls-demo/tileNew/TileMode/Dynamic/Index
     */
    tileMode?: TTileMode;
    /**
     * Минимальный размер плитки с статическим видом отображения.
     * @cfg
     * @example
     * <pre class="brush: html; highlight: [6]">
     * <!-- WML -->
     * <Controls.tile:View
     *    source="{{_viewSource}}"
     *    keyProperty="id"
     *    parentProperty="Раздел"
     *    tileSize="s"
     *    nodeProperty="Раздел@"
     *    tileMode="static">
     *    <ws:itemTemplate>
     *       ...
     *    </ws:itemTemplate>
     * </Controls.tile:View>
     * </pre>
     */
    tileSize?: TTileSize;
    /**
     * Ориентация плитки. Представляет возможность вывести горизонтальную плитку в горизонтальном контейнере скролла.
     * @cfg
     * @variant vertical - плитка выводится по строкам с переносом записей на новые строки.
     * @variant horizontal - плитка выводится в одну горизонтальную строку. Следует исопользовать вместе с горизонтальным контейнером скролла.
     * @default vertical
     * @demo Controls-demo/tileNew/Horizontal/Index
     */
    orientation?: TTileOrientation;
    /**
     * Высота элементов, отображаемых в виде плитки.
     * @cfg
     * @default 200
     */
    tileHeight?: number;
    /**
     * Ширина элементов, отображаемых в виде плитки.
     * @cfg
     * @default 250
     * @remark Эта опция необходима для расчета размеров элементов при отрисовке на сервере.
     * Если установить ширину с помощью css, компонент не будет отображен корректно.
     * Влияние опции на отрисовку шаблона плитки зависит от опции tileMode:
     * * При tileMode === 'dynamic' опция задаёт максимальную ширину, а минимальная рассчитывается с учётом коэффициента сжатия плитки (0,7).
     * * При tileMode === 'static' опция задаёт минимальную ширину.
     * @see tileMode
     */
    tileWidth?: number;
    /**
     * Имя свойства, содержащего ссылку на изображение для плитки.
     * @cfg
     * @default image
     * @remark
     * Полезные ссылки:
     * * {@link /doc/platform/developmentapl/interface-development/controls/list/tile/basic/ Руководство разработчика}
     */
    imageProperty?: string;
    /**
     * Режим отображения плитки при наведении курсора.
     * @cfg
     * @default none
     * @remark Увеличенный элемент расположен в центре относительно исходного положения.
     * Если увеличенный элемент не помещается в указанный контейнер, увеличение не происходит.
     */
    tileScalingMode?: 'none';
}

/**
 * Конфигурация смешанного списка
 * @public
 */
export interface ICompositeViewConfig
    extends ISourceOptions,
        Partial<ITreeTileCollectionOptions>,
        IItemActionsOptions,
        IHierarchyOptions,
        ITileConfig {
    /**
     * Уровень вложенности, начиная с которого узлы отображаются в виде составного элемента.
     * @cfg
     * @default 3
     */
    compositeNodesLevel?: number;
    /**
     * Определяет контрастность фона контрола по отношению к его окружению.
     * Когда включен контрастный фон, то вложенные представления составного списка отображаются на подложке в виде блока.
     * @cfg
     */
    contrastBackground?: boolean;
    /**
     * Режим отображения узлов в составном списке. Должен совпадать с leavesViewMode.
     * * tile - В виде плитки
     * * table - В виде таблицы
     * @cfg
     */
    nodesViewMode?: TCompositeViewMode;
    /**
     * Режим отображения листьев в составном списке. Должен совпадать с nodesViewMode.
     * * tile - В виде плитки
     * * table - В виде таблицы
     * @cfg
     */
    leavesViewMode?: TCompositeViewMode;
    /**
     * Шаблон, применяемый для отображения плитки
     * @cfg
     */
    itemTemplate?: TemplateFunction | React.FC | string;
    /**
     * Конфигурация шаблона плитки
     * @cfg
     */
    itemTemplateOptions?: { [key: string]: unknown };
    /**
     * Шапка таблицы при режиме отображения 'table'
     * @cfg
     * @see nodesViewMode
     * @see leavesViewMode
     */
    header?: IHeaderConfig[];
    /**
     * Колонки таблицы при режиме отображения 'table'
     * @cfg
     * @see nodesViewMode
     * @see leavesViewMode
     */
    columns?: IColumnConfig[];
    /**
     * Конфигурация отступов внутри элементов списка.
     * @cfg
     * @demo Controls-demo/gridNew/ItemPaddingNull/Index
     * @remark
     * Во избежание наслаивания текста на маркер, для списков со style='master' менять горизонтальный отступ не рекомендуется.
     * В панелях отступ слева задаётся стандартной CSS-переменной --outer_padding (см новость https://online.sbis.ru/news/3c721aca-e6d6-4404-a018-d364c2a0db26).
     * Для того, чтобы отменить действие переменной и использовать отступ, настроенный для списка, необходимо в стилях прикладного контрола установить значение --outer_padding: initial;
     * Полезные ссылки:
     * * {@link /doc/platform/developmentapl/interface-development/controls/list/list/paddings/ руководство разработчика}
     * * {@link http://axure.tensor.ru/StandardsV8/%D1%81%D0%BF%D0%B8%D1%81%D0%BE%D0%BA.html спецификация Axure}
     */
    itemPadding?: IItemPadding;
    /**
     * Скругление углов элемента.
     * @cfg
     */
    roundBorder?: IRoundBorder;
}
