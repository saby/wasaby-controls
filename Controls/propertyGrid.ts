/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
/**
 * Библиотека контролов, которые реализуют propertyGrid и набор стандартных редакторов типов.
 * Подоробнее см. {@link Controls/propertyGrid:PropertyGrid редактор свойств}
 * @library
 * @includes IItemsContainerPadding Controls/_propertyGrid/IItemsContainerPadding
 * @includes GroupTemplate Controls/propertyGrid:GroupTemplate
 * @includes ItemTemplate Controls/propertyGrid:ItemTemplate
 * @includes IPropertyGridColumn Controls/property:IPropertyGridColumn
 * @public
 * @demo Controls-demo/PropertyGridNew/Group/Expander/Index
 */

/*
 * PropertyGrid library
 * @library
 * @includes IItemsContainerPadding Controls/_propertyGrid/IItemsContainerPadding
 * @includes GroupTemplate Controls/propertyGrid:GroupTemplate
 * @includes ItemTemplate Controls/propertyGrid:ItemTemplate
 * @includes IPropertyGridColumn Controls/property:IPropertyGridColumn
 * @demo Controls-demo/PropertyGridNew/Group/Expander/Index
 * @author Герасимов А.М.
 */

import { default as PropertyGrid } from 'Controls/_propertyGrid/PropertyGrid';
import { default as PropertyGridCollectionItem } from 'Controls/_propertyGrid/PropertyGridCollectionItem';
import { default as PropertyGridCollection } from 'Controls/_propertyGrid/PropertyGridCollection';
import { default as PropertyGridGroupItem } from 'Controls/_propertyGrid/PropertyGridGroupItem';

import GroupTemplate = require('wml!Controls/_propertyGrid/Render/resources/groupTemplate');

import {
    IPropertyGridMoveOptions,
    IPropertyGridOptions,
    IPropertyGridProperty,
    IPropertyGrid,
    IProperty,
    Constants,
    ItemTemplate,
    CaptionTemplate,
    EditorTemplate,
} from 'Controls/propertyGridBase';

export {
    PropertyGrid,
    IPropertyGrid,
    IProperty,
    GroupTemplate,
    ItemTemplate,
    CaptionTemplate,
    EditorTemplate,
    PropertyGridCollectionItem,
    PropertyGridCollection,
    PropertyGridGroupItem,
    Constants,
    IPropertyGridMoveOptions,
    IPropertyGridOptions,
    IPropertyGridProperty,
};
