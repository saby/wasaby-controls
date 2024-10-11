/**
 * @kaizen_zone 26b9ed5c-cfb5-41e7-8539-2b5dfaf4a5e0
 */
/**
 * Библиотека, которая предоставляет функционал для работы драг'н'дроп в списках
 * @library
 * @includes Controller Controls/_listDragNDrop/Controller
 * @public
 */
import Controller from 'Controls/_listDragNDrop/Controller';
import Flat from 'Controls/_listDragNDrop/strategies/Flat';
import Tree from 'Controls/_listDragNDrop/strategies/Tree';

export * from 'Controls/_listDragNDrop/interface';

export { Controller as DndController, Flat as FlatStrategy, Tree as TreeStrategy };
