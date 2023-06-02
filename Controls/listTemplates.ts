/**
 * @kaizen_zone 43c2710d-a50c-4b57-865b-ea34e795bd97
 */
/**
 * Библиотека стандартных шаблонов для брузера с переключением режима отображения (плитка/дерево/список).
 * @library
 * @public
 * @author Михайлов С.Е.
 */

import * as ColorfulTemplate from 'wml!Controls/_listTemplates/ColorfulTemplate';

export { IColorfulTemplateOptions } from './_listTemplates/interface/IColorfulTemplate';
export { IListItemTemplateOptions } from './_listTemplates/interface/IListItemTemplate';
export { ITableCellTemplateOptions } from './_listTemplates/interface/ITableCellTemplate';

import ListItemRender from './_listTemplates/render/ListItemRender';
import TableCellRender from './_listTemplates/render/TableCellRender';

export {
    default as ImageDisplayContainer,
    IImageDisplayContainerOptions,
} from 'Controls/_listTemplates/ImageDisplay/ImageDisplayContainer';

export {
    ListItemRender as ListItemTemplate,
    TableCellRender as TableCellTemplate,
    ColorfulTemplate,
    ListItemRender,
    TableCellRender };
