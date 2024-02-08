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

import {
    default as PropertyGrid,
    IPropertyGridMoveOptions,
} from 'Controls/_propertyGrid/PropertyGrid';
import 'Controls/deprecatedItemActions';
import { default as PropertyGridCollectionItem } from 'Controls/_propertyGrid/PropertyGridCollectionItem';
import { default as PropertyGridCollection } from 'Controls/_propertyGrid/PropertyGridCollection';
import { default as PropertyGridGroupItem } from 'Controls/_propertyGrid/PropertyGridGroupItem';

import { default as TabbedView } from 'Controls/_propertyGrid/TabbedView';
import { IPropertyGridOptions } from 'Controls/_propertyGrid/IPropertyGrid';
import { default as IPropertyGridProperty } from 'Controls/_propertyGrid/IProperty';
import IPropertyGrid = require('Controls/_propertyGrid/IPropertyGrid');
import { default as IProperty } from 'Controls/_propertyGrid/IProperty';
import * as Constants from 'Controls/_propertyGrid/Constants';

import GroupTemplate = require('wml!Controls/_propertyGrid/Render/resources/groupTemplate');
import * as ItemTemplate from 'wml!Controls/_propertyGrid/Render/resources/itemTemplate';
import * as CaptionTemplate from 'wml!Controls/_propertyGrid/Render/resources/captionTemplate';
import * as EditorTemplate from 'wml!Controls/_propertyGrid/Render/resources/editorTemplate';

import { register } from 'Types/di';

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
    TabbedView,
    Constants,
    IPropertyGridMoveOptions,
    IPropertyGridOptions,
    IPropertyGridProperty,
};

register('Controls/propertyGrid:PropertyGridCollectionItem', PropertyGridCollectionItem, {
    instantiate: false,
});
register('Controls/propertyGrid:PropertyGridCollection', PropertyGridCollection, {
    instantiate: false,
});
