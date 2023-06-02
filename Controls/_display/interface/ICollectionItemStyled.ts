/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
/**
 * Интерфейс стилизованного элемента коллекции
 *
 * @interface Controls/_display/interface/ICollectionItemStyled
 * @public
 */
/*
 * Interface of styled item of collection
 *
 * @interface Controls/_display/interface/ICollectionItemStyled
 * @public
 * @author Аверкиев П.А.
 */
import { TBackgroundStyle } from 'Controls/interface';

export interface ICollectionItemStyled {
    getMultiSelectClasses(): string;
    getWrapperClasses(
        templateHighlightOnHover: boolean,
        cursor: string,
        backgroundColorStyle?: TBackgroundStyle,
        showItemActionsOnHover?: boolean
    ): string;
    getContentClasses(): string;

    /**
     * Возвращает классы CSS для отображения действий над записью
     * @name Controls/_display/interface/ICollectionItemStyled#getItemActionClasses
     * @param itemActionsPosition позиция по отношению к записи: 'inside' | 'outside'
     */
    getItemActionClasses(itemActionsPosition: string): string;
    /**
     * Возвращает Класс для позиционирования опций записи.
     * Если опции вне строки, то возвращает пустую строку
     * Если itemActionsClass не задан, возвращает классы для позиции itemPadding top
     * Иначе возвращает классы, соответствующие заданным параметрам itemActionsClass и itemPadding
     * @name Controls/_display/interface/ICollectionItemStyled#getItemActionPositionClasses
     * @param itemActionsPosition
     * @param itemActionsClass
     * @param itemPadding
     */
    getItemActionPositionClasses(
        itemActionsPosition: string,
        itemActionsClass: string,
        itemPadding: { top?: string; bottom?: string }
    ): string;
}
