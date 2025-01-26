import type { breadCrumbs } from '../types';
import type { Model } from 'Types/entity';
import aCreator from './_actionCreator';

/**
 * Конструктор действия, для установки новых хлебных крошек.
 * @function
 * @param {null | Model[]} breadCrumbsItems Хлебные крошки
 * @param {string} backButtonCaption Текст кнопки назад
 * @param {Model} backButtonItem Запись для кнопки назад
 * @return breadCrumbs.TSetBreadCrumbsAction
 */
export const setBreadCrumbs = (
    breadCrumbsItems: null | Model[],
    backButtonCaption: string = '',
    backButtonItem: Model | undefined
): breadCrumbs.TSetBreadCrumbsAction =>
    aCreator('setBreadCrumbs', {
        breadCrumbsItems,
        backButtonCaption,
        backButtonItem,
    });
