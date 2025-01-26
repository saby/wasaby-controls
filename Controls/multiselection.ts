/**
 * @kaizen_zone 02f42333-cf50-42e8-bc08-b451cc483285
 */
/**
 * Библиотека, которая предоставляет функционал для множественного выбора
 * @library
 * @includes IFlatSelectionStrategy Controls/_multiselection/IFlatSelectionStrategy
 * @includes ISelectionController Controls/_multiselection/ISelectionController
 * @includes ITreeSelectionStrategy Controls/_multiselection/ITreeSelectionStrategy
 * @public
 */

import { Controller as SelectionController } from 'Controls/_multiselection/Controller';
import {
    default as CounterController,
    ICounterControllerOptions,
} from 'Controls/_multiselection/CounterController';
import { FlatSelectionStrategy } from 'Controls/_multiselection/SelectionStrategy/Flat';
import { TreeSelectionStrategy } from 'Controls/_multiselection/SelectionStrategy/Tree';
import { default as ISelectionStrategy } from 'Controls/_multiselection/SelectionStrategy/ISelectionStrategy';
import { default as SingleSelection } from 'Controls/_multiselection/Adapters/SingleSelection';
import {
    ISelectionItem,
    ISelectionModel,
    ISelectionControllerOptions,
    IFlatSelectionStrategyOptions,
    ITreeSelectionStrategyOptions,
    IKeysDifference,
    ISelectionDifference,
} from 'Controls/_multiselection/interface';

import * as Utils from 'Controls/_multiselection/Utils/General';

export {
    ISelectionItem,
    SelectionController,
    ISelectionControllerOptions,
    ISelectionDifference,
    ISelectionModel,
    IKeysDifference,
    ISelectionStrategy,
    FlatSelectionStrategy,
    IFlatSelectionStrategyOptions,
    TreeSelectionStrategy,
    ITreeSelectionStrategyOptions,
    SingleSelection,
    Utils,
    CounterController,
    ICounterControllerOptions,
};

export { FlatSelectionStrategy as NewFlatSelectionStrategy } from 'Controls/_multiselection/SelectionStrategy/flat/FlatSelectionStrategy';
export { HierarchySelectionStrategy as NewHierarchySelectionStrategy } from 'Controls/_multiselection/SelectionStrategy/hierarchy/HierarchySelectionStrategy';
export { IHierarchySelectionState } from 'Controls/_multiselection/SelectionStrategy/hierarchy/IHierarchySelectionState';
