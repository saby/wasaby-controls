/**
 * @kaizen_zone ba2b1294-cc16-4bec-aaf4-e4f0bc5bd89b
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
    ISelectionDifference,
} from 'Controls/_multiselection/interface';

import * as Utils from 'Controls/_multiselection/Utils/General';

export {
    ISelectionItem,
    SelectionController,
    ISelectionControllerOptions,
    ISelectionDifference,
    ISelectionModel,
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
