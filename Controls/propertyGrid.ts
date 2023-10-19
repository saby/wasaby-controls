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
// eslint-disable-next-line deprecated-anywhere
import 'Controls/deprecatedItemActions';
import { default as PropertyGridCollectionItem } from 'Controls/_propertyGrid/PropertyGridCollectionItem';
import { default as PropertyGridCollection } from 'Controls/_propertyGrid/PropertyGridCollection';
import { default as PropertyGridGroupItem } from 'Controls/_propertyGrid/PropertyGridGroupItem';
import BooleanEditor = require('Controls/_propertyGrid/defaultEditors/Boolean');
import StringEditor = require('Controls/_propertyGrid/defaultEditors/String');
import TextEditor = require('Controls/_propertyGrid/defaultEditors/Text');
import EnumEditor = require('Controls/_propertyGrid/defaultEditors/Enum');
import { default as DateEditor } from 'Controls/_propertyGrid/defaultEditors/Date';
import { default as NumberEditor } from 'Controls/_propertyGrid/defaultEditors/Number';
import BooleanGroupEditor = require('Controls/_propertyGrid/extendedEditors/BooleanGroup');
import FlatEnumEditor = require('Controls/_propertyGrid/extendedEditors/FlatEnum');
import { default as DropdownEditor } from 'Controls/_propertyGrid/extendedEditors/Dropdown';
import { default as LookupEditor } from 'Controls/_propertyGrid/extendedEditors/Lookup';
import { default as CheckboxGroupEditor } from 'Controls/_propertyGrid/extendedEditors/CheckboxGroup';
import { default as ChipsEditor } from 'Controls/_propertyGrid/extendedEditors/Chips';
import { default as TimeIntervalEditor } from 'Controls/_propertyGrid/extendedEditors/TimeInterval';
import { default as InputMaskEditor } from 'Controls/_propertyGrid/extendedEditors/InputMask';
import { default as LogicEditor } from 'Controls/_propertyGrid/extendedEditors/Logic';
import { default as PhoneEditor } from 'Controls/_propertyGrid/extendedEditors/Phone';
import { default as DateRangeEditor } from 'Controls/_propertyGrid/extendedEditors/DateRange';

import { default as TabbedView } from 'Controls/_propertyGrid/TabbedView';

import IPropertyGrid = require('Controls/_propertyGrid/IPropertyGrid');
import { default as IEditor } from 'Controls/_propertyGrid/IEditor';
import { default as IProperty } from 'Controls/_propertyGrid/IProperty';
import * as Constants from 'Controls/_propertyGrid/Constants';

import GroupTemplate = require('wml!Controls/_propertyGrid/Render/resources/groupTemplate');
import * as ItemTemplate from 'wml!Controls/_propertyGrid/Render/resources/itemTemplate';
import * as CaptionTemplate from 'wml!Controls/_propertyGrid/Render/resources/captionTemplate';
import * as EditorTemplate from 'wml!Controls/_propertyGrid/Render/resources/editorTemplate';
import * as JumpingLabelContainer from 'wml!Controls/_propertyGrid/JumpingLabelContainer';

import { register } from 'Types/di';

export {
    PropertyGrid,
    BooleanEditor,
    StringEditor,
    TextEditor,
    EnumEditor,
    NumberEditor,
    DateEditor,
    BooleanGroupEditor,
    FlatEnumEditor,
    TimeIntervalEditor,
    InputMaskEditor,
    CheckboxGroupEditor,
    ChipsEditor,
    DropdownEditor,
    LookupEditor,
    LogicEditor,
    PhoneEditor,
    DateRangeEditor,
    IPropertyGrid,
    IEditor,
    IProperty,
    GroupTemplate,
    ItemTemplate,
    CaptionTemplate,
    EditorTemplate,
    PropertyGridCollectionItem,
    PropertyGridCollection,
    PropertyGridGroupItem,
    TabbedView,
    JumpingLabelContainer,
    Constants,
    IPropertyGridMoveOptions,
};

register('Controls/propertyGrid:PropertyGridCollectionItem', PropertyGridCollectionItem, {
    instantiate: false,
});
register('Controls/propertyGrid:PropertyGridCollection', PropertyGridCollection, {
    instantiate: false,
});
