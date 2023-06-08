/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import { IInstantiable, IVersionable, Model } from 'Types/entity';
import { ICollection } from './ICollection';
import { CrudEntityKey } from 'Types/source';

/**
 * Варианты значений для опции rowSeparatorSize
 * @typedef {String} Controls/_display/interface/ICollectionItem/TRowSeparatorSize
 * @variant s тонкие разделители
 * @variant l толстые разделители
 * @variant null без разделителей
 */
export type TRowSeparatorSize = 's' | 'l' | 'null';

/**
 * Варианты значений для опции columnSeparatorSize
 * @typedef {String} Controls/_display/interface/ICollectionItem/TColumnSeparatorSize
 * @variant s тонкие разделители
 * @variant null без разделителей
 */
export type TColumnSeparatorSize = 's' | 'null';

/**
 * Варианты значений для опции rowSeparatorVisibility
 * @typedef {String} Controls/_display/interface/ICollectionItem/TRowSeparatorVisibility
 * @variant all Разделители строк и по краям списка и между записями
 * @variant edges разделители только по краям
 * @variant items разделители только между записями
 */
export type TRowSeparatorVisibility = 'all' | 'items' | 'edges';

/**
 * Варианты значений для опции itemsSpacingVisibility
 * @typedef {String} Controls/_display/interface/ICollectionItem/TItemsSpacingVisibility
 * @variant all Промежутки между записями и вокруг списка
 * @variant items Промежутки только между записями
 */
export type TItemsSpacingVisibility = 'all' | 'items';

/**
 * Варианты значений для опции видимоcти рамки вокруг записи (borderVisibility)
 * @typedef {String} Controls/_display/interface/ICollectionItem/TBorderVisibility
 * @variant hidden рамка скрыта
 * @variant visible рамка показана всегда
 * @variant onhover рамка показывается по ховеру на запись
 */
export type TBorderVisibility = 'hidden' | 'visible' | 'onhover';

/**
 * Варианты значений для стиля цвета рамки вокруг записи.
 * @typedef {String} Controls/_display/interface/ICollectionItem/TBorderStyle
 * @variant default
 * @variant danger
 */
export type TBorderStyle = 'default' | 'danger' | string;

/**
 * Варианты значений для опции видимости тени вокруг записи (shadowVisibility)
 * @typedef {String} Controls/_display/interface/ICollectionItem/TShadowVisibility
 * @variant hidden тень скрыта
 * @variant visible тень показана всегда
 * @variant onhover тень показывается по ховеру на запись
 */
export type TShadowVisibility = 'hidden' | 'visible' | 'onhover' | 'dragging';

/**
 * Варианты настройки размеров маркера
 * @typedef {String} Controls/_display/interface/ICollectionItem/TMarkerSize
 * @variant content-xl Используется для размещения маркера в случае, когда содержимое записи должно быть расположено на нескольких строках.
 * @variant content-xs Используется для размещения маркера в случае, когда содержимое записи должно быть расположено в одной строке.
 * @variant image-l Используется для размещения маркера рядом с изображением размера "l".
 * @variant image-m Используется для размещения маркера рядом с изображением размера "m".
 * @variant image-mt Используется для размещения маркера рядом с изображением размера "mt".
 * @variant image-s Используется для размещения маркера рядом с изображением размера "s".
 */
export type TMarkerSize =
    | 'image-l'
    | 'image-m'
    | 'image-mt'
    | 'image-s'
    | 'content-xl'
    | 'content-xs';

export interface ICollectionItem<S extends Model = Model> extends IInstantiable, IVersionable {
    getOwner(): ICollection<S, ICollectionItem>;
    setOwner(owner: ICollection<S, ICollectionItem>): void;

    /**
     * Получить представление текущего элемента
     * @function
     * @public
     * @return {Types/entity:Model} Опции записи
     */
    getContents(): S;
    setContents(contents: S, silent?: boolean): void;
    getUid(): string;

    key: CrudEntityKey;
}
