/**
 * @kaizen_zone c4f41dc0-617f-4dae-a3e8-78fd94e09ce2
 */
import { TemplateFunction } from 'UI/Base';

export interface IFieldTemplateOptions {
    leftFieldTemplate?: TemplateFunction;
    rightFieldTemplate?: TemplateFunction;
}

/**
 * Интерфейс для полей ввода, которые поддерживают шаблоны слева и справа от текста.
 * @public
 */
export interface IFieldTemplate {
    readonly '[Controls/_input/interface/IFieldTemplate]': boolean;
}

/**
 * @name Controls/_input/interface/IFieldTemplate#leftFieldTemplate
 * @cfg {String|TemplateFunction} Строка или шаблон, содержащие прикладной контент, который будет отображаться слева от текста в поле ввода.
 * @demo Controls-demo/Input/FieldTemplate/Index
 */
/**
 * @name Controls/_input/interface/IFieldTemplate#rightFieldTemplate
 * @cfg {String|TemplateFunction} Строка или шаблон, содержащие прикладной контент, который будет отображаться справа от текста в поле ввода.
 * @demo Controls-demo/Input/FieldTemplate/Index
 */
