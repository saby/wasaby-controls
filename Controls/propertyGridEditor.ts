/**
 * @kaizen_zone 23b84c4b-cdab-4f76-954a-5f81cd39df3f
 */
/**
 * Библиотека контролов, которые реализуют редактор конфигурации propertyGrid.
 * @library
 * @public
 */

/*
 * Library of controls that implement the PropertyGrid configuration editor
 * @library
 * @author Герасимов А.М.
 */

import { default as PropertyGridEditor } from 'Controls/_propertyGridEditor/PropertyGridEditor';
import * as CaptionTemplate from 'wml!Controls/_propertyGridEditor/render/captionColumn';
import * as GroupTemplate from 'wml!Controls/_propertyGridEditor/render/groupTemplate';
import { default as ItemTemplate } from 'Controls/_propertyGridEditor/render/itemTemplate';
import PropertyGridEditorCollection from 'Controls/_propertyGridEditor/display/PropertyGridEditorCollection';
import PropertyGridEditorCollectionItem from 'Controls/_propertyGridEditor/display/PropertyGridEditorCollectionItem';

export { PropertyGridEditor, CaptionTemplate, GroupTemplate, ItemTemplate };

import { register } from 'Types/di';

register(
    'Controls/propertyGridEditor:PropertyGridEditorCollectionItem',
    PropertyGridEditorCollectionItem,
    { instantiate: false }
);
register(
    'Controls/propertyGridEditor:PropertyGridEditorCollection',
    PropertyGridEditorCollection,
    { instantiate: false }
);
