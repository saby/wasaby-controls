/**
 * @kaizen_zone 5027e156-2300-4ab3-8a3a-d927588bb443
 */
import { Record } from 'Types/entity';
import { IControlOptions } from 'UI/Base';
import { IFontSizeOptions } from 'Controls/interface';

export interface IBreadCrumbsOptions extends IControlOptions, IFontSizeOptions {
    items: Record[];
    keyProperty: string;
    parentProperty: string;
    displayProperty: string;
    containerWidth: number;
    breadCrumbsItemClickCallback: (event: Event, item: Record) => void;
    highlighter?: Function | Function[];
    readonly: boolean;
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
 * @cfg {Array.<Record>} Массив хлебных крошек.
 */

/*
 * @name Controls/_breadcrumbs/interface/IBreadCrumbs#items
 * @cfg {Array.<Record>} Array of breadcrumbs to draw.
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
 * @typedef {String} BackgroundStyle
 * @variant master Предназначен для настройки фона masterDetail
 * @variant stack Предназначен для настройки фона стековой панели.
 * @variant detailContrast Определяет контрастность фона для области detail по отношению к окружению.
 * @variant listItem Предназначен для настройки фона элементов списка.
 * @variant stackHeader Предназначен для настройки фона шапки стековой панели.
 * @variant default фон по-умолчанию
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
