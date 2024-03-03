/**
 * @kaizen_zone 9beb6001-b33d-4e7f-87af-c7bc9798e225
 */
import { IItemActionsObject } from './IItemActionsObject';
import type { TAnimationState, ICollectionItem } from 'Controls/display';

/**
 * Интерфейс элемента коллекции, который обладает опциями записи
 * @public
 */

/*
 * Interface of collection element that posses item actions
 * @interface Controls/_itemActions/interface/IItemActionsItem
 * @public
 * @author Аверкиев П.А.
 */
export interface IItemActionsItem extends ICollectionItem {
    SupportItemActions: boolean;

    /**
     * Получить опции записи
     * @public
     * @return {Controls/_itemActions/interface/IItemActionsObject} Опции записи
     */
    getActions(): IItemActionsObject;

    /**
     * Установить опции записи
     * @param {Controls/_itemActions/interface/IItemActionsObject} actions Опции записи
     * @param {boolean} [silent=false] Не генерировать событие onCurrentChange
     * @public
     */
    setActions(actions: IItemActionsObject, silent?: boolean): void;

    /**
     * Получить состояние активности текущего элемента
     * @public
     * @return {Boolean} Состояние активности текущего элемента
     */
    isActive(): boolean;

    /**
     * Установить состояние активности текущего элемента
     * @param {Boolean} active Состояние активности текущего элемента
     * @param {Boolean} silent Не генерировать событие onCurrentChange
     * @public
     */
    setActive(active: boolean, silent?: boolean): void;

    /**
     * Получить состояние свайпа текущего элемента
     * @public
     * @return {Boolean} Состояние свайпа текущего элемента
     */
    isSwiped(): boolean;

    /**
     * Установить состояние свайпа текущего элемента
     * @param {Boolean} swiped Состояние свайпа текущего элемента
     * @param {Boolean} silent Не генерировать событие onCurrentChange
     * @public
     */
    setSwiped(swiped: boolean, silent?: boolean): void;

    /**
     * Получить состояние редактирования текущего элемента
     * @public
     * @return {Boolean} Состояние редактирования текущего элемента
     */
    isEditing(): boolean;

    /**
     * Установить в модель текущее состояние анимации
     * @param {Controls/display/TAnimationState.typedef} state Текущее состояние анимации
     * @public
     */
    setSwipeAnimation?(state: TAnimationState): void;

    /**
     * Получить текущее состояние анимации
     * @public
     * @return {Controls/display/TAnimationState.typedef} Текущее состояние анимации
     */
    getSwipeAnimation?(): TAnimationState;
}
