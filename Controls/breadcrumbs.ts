/**
 * @kaizen_zone 5027e156-2300-4ab3-8a3a-d927588bb443
 */
/**
 * Библиотека контролов, которые служат для поддержки навигации, позволяющей пользователю перейти c текущей страницы/документа на любой уровень вложенности.
 * @library
 * @includes IBreadCrumbs Controls/_breadcrumbs/interface/IBreadCrumbs
 * @includes IHeadingPath Controls/_breadcrumbs/interface/IHeadingPath
 * @includes IPathButton Controls/_breadcrumbs/PathButton/interfaces
 * @includes Container Controls/_breadcrumbs/Container
 * @public
 */

/*
 * Breadcrumbs library
 * @library
 * @author Авраменко А. С.
 */
import ItemTemplate = require('wml!Controls/_breadcrumbs/View/resources/itemTemplate');
import Container = require('wml!Controls/_breadcrumbs/WrappedContainer');

export { default as Path } from './_breadcrumbs/Path';
export { default as View } from './_breadcrumbs/View';
export { default as PathButton } from './_breadcrumbs/PathButton';
export * from 'Controls/_breadcrumbs/PathButton/interfaces';
export * from 'Controls/_breadcrumbs/interface/IHeadingPath';
export { default as HeadingPath } from './_breadcrumbs/HeadingPath';
export { default as MultilinePath } from './_breadcrumbs/MultilinePath';
export { default as HeadingPathBack } from './_breadcrumbs/HeadingPath/Back';
export { default as HeadingPathCommon } from './_breadcrumbs/HeadingPath/Common';
export { ItemTemplate, Container };
