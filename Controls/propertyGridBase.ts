/**
 * @kaizen_zone f0d65b38-6289-4183-af0e-3ba42b944b0d
 */
import {
    default as PropertyGrid,
    IPropertyGridMoveOptions,
} from 'Controls/_propertyGridBase/PropertyGrid';
import {
    default as PropertyGridCollectionItem,
    TPropertyGridCollectionItem,
    TPropertyGridCollectionItemConstructor,
} from 'Controls/_propertyGridBase/PropertyGridCollectionItem';
import { getPropertyGridCollectionItem } from 'Controls/_propertyGridBase/getPropertyGridCollectionItem';
import {
    default as PropertyGridCollection,
    TPropertyGridCollection,
    TPropertyGridCollectionConstructor,
} from 'Controls/_propertyGridBase/PropertyGridCollection';
import { getPropertyGridCollection } from 'Controls/_propertyGridBase/getPropertyGridCollection';

import { IPropertyGridOptions } from 'Controls/_propertyGridBase/IPropertyGrid';
import { default as IPropertyGridProperty } from 'Controls/_propertyGridBase/IProperty';
import IPropertyGrid = require('Controls/_propertyGridBase/IPropertyGrid');
import { default as IProperty } from 'Controls/_propertyGridBase/IProperty';
import * as Constants from 'Controls/_propertyGridBase/Constants';

import * as ItemTemplate from 'wml!Controls/_propertyGridBase/Render/resources/itemTemplate';
import * as CaptionTemplate from 'wml!Controls/_propertyGridBase/Render/resources/captionTemplate';
import * as EditorTemplate from 'wml!Controls/_propertyGridBase/Render/resources/editorTemplate';
import * as ForTemplate from 'wml!Controls/_propertyGridBase/Render/resources/for';

import 'css!Controls/propertyGridBase';

export {
    PropertyGrid,
    IPropertyGrid,
    IProperty,
    ItemTemplate,
    CaptionTemplate,
    EditorTemplate,
    ForTemplate,
    PropertyGridCollectionItem,
    TPropertyGridCollectionItem,
    TPropertyGridCollectionItemConstructor,
    getPropertyGridCollectionItem,
    PropertyGridCollection,
    TPropertyGridCollection,
    TPropertyGridCollectionConstructor,
    getPropertyGridCollection,
    Constants,
    IPropertyGridMoveOptions,
    IPropertyGridOptions,
    IPropertyGridProperty,
};
