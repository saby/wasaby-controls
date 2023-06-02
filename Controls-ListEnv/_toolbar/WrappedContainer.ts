import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv/_toolbar/WrappedContainer';

export default class WrappedContainer extends Control {
    protected _template: TemplateFunction = template;
}
