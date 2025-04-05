/**
 * Библиотека, содержащая дескрипторы runtime ошибок списков.
 * Дескрипторы необщодимы для отладки и носят информационный характер для разработчиков.
 * Библиотека должна запрашиваться строго асинхронно, при возникновении ошибки.
 * Исправно работающий код не должен "тянуть" лишний трафик.
 *
 * @library
 * @public
 * @module
 * @kaizenZone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
export * as Interactor from './newLists/_errorDescriptors/Interactor';
export * as Dispatcher from './newLists/_errorDescriptors/Dispatcher';
