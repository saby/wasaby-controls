/**
 * @kaizen_zone b9a403ff-e006-4511-98de-c3f6c764b219
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

export {
    Controller as DndController,
    Flat as FlatStrategy,
    Tree as TreeStrategy,
};
