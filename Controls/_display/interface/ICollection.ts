/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import { DestroyableMixin, Model, ObservableMixin } from 'Types/entity';
import { IEnumerable } from '../Abstract';
import { IBaseCollection } from 'Controls/_display/interface';
import { ICollectionItem } from 'Controls/_display/interface/ICollectionItem';
import { TPaddingSize } from 'Controls/interface';

export interface ISourceCollection<T> extends IEnumerable<T>, DestroyableMixin, ObservableMixin {
    getCount(): number;

    at(i: number): T;
}

/**
 * @typedef {String} Controls/_display/interface/ICollection/TVerticalItemPadding
 * @variant s
 * @variant null
 * @variant default
 */
export type TVerticalItemPadding = 's' | 'null' | 'default' | string;

export type THorizontalItemPadding = TPaddingSize;

export type TLogError = (errorText: string) => void;

/**
 * Интерфейс настройки отступов записи
 * @interface Controls/_display/interface/ICollection/IItemPadding
 * @public
 */
/* ENG
 * Item padding settings interface
 * @Interface Controls/_display/interface/ICollection/IItemPadding
 * @public
 * @author Авраменко А.С.
 */
export interface IItemPadding {
    /**
     * @name Controls/_display/interface/ICollection/IItemPadding#top
     * @cfg {Controls/_display/interface/ICollection/TVerticalItemPadding.typedef} Отступ записи сверху
     */
    top?: TVerticalItemPadding;
    /**
     * @name Controls/_display/interface/ICollection/IItemPadding#bottom
     * @cfg {Controls/_display/interface/ICollection/TVerticalItemPadding.typedef} Отступ записи снизу
     */
    bottom?: TVerticalItemPadding;
    /**
     * @name Controls/_display/interface/ICollection/IItemPadding#left
     * @cfg {Controls/_interface/TPaddingSize.typedef} Отступ записи слева
     */
    left?: TPaddingSize;
    /**
     * @name Controls/_display/interface/ICollection/IItemPadding#right
     * @cfg {Controls/_interface/TPaddingSize.typedef} Отступ записи справа
     */
    right?: TPaddingSize;
}

/*
 * @typedef {string} TAnimationState
 * @description Состояние анимации свайпа
 * @variant open Открывается ItemActions по свайпу
 * @variant close Закрывается ItemActions по свайпу
 * @variant right-swipe Элемент свайпнут вправо.
 */
export type TAnimationState = 'close' | 'open' | 'right-swipe';

/*
 * Интерфейс коллекции, по которому CollectionItem обращается к Collection
 *
 * @interface Controls/_display/interface/ICollection
 * @private
 * @author Аверкиев П.А.
 */
/*
 * Collection interface to call Collection methods from CollectionItem
 *
 * @interface Controls/_display/interface/ICollection
 * @private
 * @author Аверкиев П.А.
 */

export interface ICollection<S extends Model, T extends ICollectionItem>
    extends IBaseCollection<S, T> {
    getSourceCollection(): ISourceCollection<S>;
    getDisplayProperty(): string;
    getMultiSelectVisibility(): string;
    getMultiSelectPosition(): 'default' | 'custom';
    getTopPadding(): string;
    getBottomPadding(): string;
    getRightPadding(): string;
    getLeftPadding(): string;
    getStyle(): string;
    getItemUid(item: T): string;
    getRowSeparatorSize(): string;
    getItemsDragNDrop(): boolean;
    notifyItemChange(item: T, properties: string): void;
    getEditingBackgroundStyle(): string;
}

/**
 * Допустимые значения для опции {@link groupViewMode}.
 * @typedef {String} Controls/_display/interface/ICollection/TGroupViewMode
 * @variant default Режим по умлочанию, записи внутри групп никак не выделены.
 * @variant blocks Записи в групе отображаются на подложке в виде блоков.
 * @variant titledBlocks Заголовок и записи в группе отображаются на подложке в виде блоков, включающих заголовок группы.
 */
export type TGroupViewMode = 'blocks' | 'titledBlocks' | 'default';
