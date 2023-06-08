/**
 * @kaizen_zone 43c2710d-a50c-4b57-865b-ea34e795bd97
 */
/**
 * Библиотека стандартных шаблонов для брузера с переключением режима отображения (плитка/дерево/список).
 * @library
 * @public
 * @author Михайлов С.Е.
 */
import * as ListItemTemplate from 'wml!Controls/_listTemplates/ListItemTemplate';
import * as TableCellTemplate from 'wml!Controls/_listTemplates/TableCellTemplate';
import * as ColorfulTemplate from 'wml!Controls/_listTemplates/ColorfulTemplate';

export { IColorfulTemplateOptions } from './_listTemplates/interface/IColorfulTemplate';
export { IListItemTemplateOptions } from './_listTemplates/interface/IListItemTemplate';
export { ITableCellTemplateOptions } from './_listTemplates/interface/ITableCellTemplate';
export {
    default as ImageDisplayContainer,
    IImageDisplayContainerOptions,
} from 'Controls/_listTemplates/ImageDisplay/ImageDisplayContainer';

export { ListItemTemplate, TableCellTemplate, ColorfulTemplate };
