/**
 * Библиотека загрузки статики для списков.
 * Здесть представлена декларация библиотек списков и метод для их загрузки при необходимости,
 * относительно состояния интерактора.
 *
 * Подробнее о интеракторах написано в {@link https://n.sbis.ru/shared/disk/eebbf702-d40d-4d35-b55c-8b8793f99f3d документе}.
 *
 * @library
 * @public
 * @module
 * @kaizenZone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
export { default as load } from './newLists/_staticLoader/base/load';
export { LibPaths } from './newLists/_staticLoader/abstractList/constants';
export { getUnloadedDeps } from './newLists/_staticLoader/abstractList/loader';
