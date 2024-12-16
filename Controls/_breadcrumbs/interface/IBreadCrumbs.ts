/**
 * @kaizen_zone 5027e156-2300-4ab3-8a3a-d927588bb443
 */
import { Record } from 'Types/entity';
import { IControlOptions } from 'UI/Base';
import { RecordSet } from 'Types/collection';
import { IFontSizeOptions, TBackgroundStyle } from 'Controls/interface';

export interface IBreadCrumbsOptions extends IControlOptions, IFontSizeOptions {
    items: Record[] | RecordSet;
    keyProperty: string;
    parentProperty: string;
    displayProperty: string;
    containerWidth: number;
    breadCrumbsItemClickCallback: (event: Event, item: Record) => void;
    highlighter?: Function | Function[];
    readonly: boolean;
    backgroundStyle?: TBackgroundStyle;
}

/**
 * Интерфейс для контролов, отображающих "хлебные крошки".
 * @interface Controls/_breadcrumbs/interface/IBreadCrumbs
 * @public
 */

/*
 * Interface for breadcrumbs.
 *
 * @interface Controls/_breadcrumbs/interface/IBreadCrumbs
 * @public
 * @author Авраменко А.С.
 */

/**
 * @name Controls/_breadcrumbs/interface/IBreadCrumbs#items
 * @cfg {Array.<Record>|Types/collection:RecordSet} Массив хлебных крошек.
 */

/*
 * @name Controls/_breadcrumbs/interface/IBreadCrumbs#items
 * @cfg {Array.<Record>|Types/collection:RecordSet} Array of breadcrumbs to draw.
 */

/**
 * @name Controls/_breadcrumbs/interface/IBreadCrumbs#keyProperty
 * @cfg {String} Имя свойства, содержащего информацию об идентификаторе текущей строки.
 * @see parentProperty
 * @see displayProperty
 */

/*
 * @name Controls/_breadcrumbs/interface/IBreadCrumbs#keyProperty
 * @cfg {String} Name of the item property that uniquely identifies collection item.
 */

/**
 * @name Controls/_breadcrumbs/interface/IBreadCrumbs#parentProperty
 * @cfg {String} Имя свойства, содержащего сведения о родительском узле.
 * @see keyProperty
 * @see displayProperty
 */

/*
 * @name Controls/_breadcrumbs/interface/IBreadCrumbs#parentProperty
 * @cfg {String} Name of the field that contains information about parent node.
 */

/**
 * @name Controls/_breadcrumbs/interface/IBreadCrumbs#displayProperty
 * @cfg {String} Имя свойства элемента, содержимое которого будет отображаться.
 * @default title
 * @see keyProperty
 * @see parentProperty
 */

/*
 * @name Controls/_breadcrumbs/interface/IBreadCrumbs#displayProperty
 * @cfg {String} Name of the item property which content will be displayed.
 * @default title
 */

/**
 * Типы значений фона для опции {@link Controls/_breadcrumbs/interface/IBreadCrumbs#backgroundStyle backgroundStyle}.
 * Каждому значению соответствует цвет. Он зависит от {@link /doc/platform/developmentapl/interface-development/themes/ темы оформления} приложения.
 * см. также {@link https://www.figma.com/proto/aoDaE5WOM1bcQMqXhz3uIH/%E2%9C%94%EF%B8%8F-%D0%A2%D0%B5%D0%BC%D0%B0-%D0%BE%D1%84%D0%BE%D1%80%D0%BC%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BF%D0%BE-%D1%83%D0%BC%D0%BE%D0%BB%D1%87%D0%B0%D0%BD%D0%B8%D1%8E?page-id=299%3A11&node-id=51892-34740&viewport=241%2C48%2C0.24&scaling=min-zoom&starting-point-node-id=51892%3A34740 Основные цвета online}
 * @typedef {String} BackgroundStyle
 * @variant default фон по-умолчанию
 * @variant danger
 * @variant success
 * @variant warning
 * @variant primary
 * @variant secondary
 * @variant unaccented
 * @variant info
 * @variant contrast
 * @variant transparent Прозрачный фон
 * @variant master Предназначен для настройки фона для области master {@link /docs/js/Controls/masterDetail/Base/ Controls/MasterDetail:Base}
 * @variant detailContrast Определяет контрастность фона для области detail по отношению к окружению. Применяется при использовании {@link /docs/js/Controls/masterDetail/Base/ Controls/MasterDetail:Base}
 * @variant stack Предназначен для настройки фона стековой панели.
 * @variant listItem Предназначен для настройки фона элементов таблицы.
 * @variant stackHeader Предназначен для настройки фона шапки стековой панели.
 */

/**
 * @name Controls/_breadcrumbs/interface/IBreadCrumbs#backgroundStyle
 * @cfg {BackgroundStyle} Префикс стиля для настройки фона внутренних компонентов хлебных крошек.
 * @default default
 * @remark
 * Поддерживается стандартная палитра цветов.
 * @demo Controls-demo/BreadCrumbs/backgroundStyle/Index
 */

/**
 * @name Controls/_breadcrumbs/interface/IBreadCrumbs#containerWidth
 * @cfg {Number} Ширина контейнера крошек.
 * Необходимо указывать для правильного расчета ширины крошек на сервере и клиенте.
 * @remark Задание опции позволяет избежать скачков при при первом построении контрола
 * @demo Controls-demo/BreadCrumbs/ContainerWidth/Index
 */

/**
 * @event itemClick Происходит после клика по хлебным крошкам.
 * @name Controls/_breadcrumbs/interface/IBreadCrumbs#itemClick
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Record} item Элемент, по которому произвели клик.
 * @demo Controls-demo/BreadCrumbs/ItemClick/Index.tsx
 */

/*
 * @event Happens after clicking on breadcrumb.
 * @name Controls/_breadcrumbs/interface/IBreadCrumbs#itemClick
 * @param {UI/Events:SyntheticEvent} eventObject Descriptor of the event.
 * @param {Types/entity:Record} item Key of the clicked item.
 */
