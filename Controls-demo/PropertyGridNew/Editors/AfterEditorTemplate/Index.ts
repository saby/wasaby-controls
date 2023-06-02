import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/PropertyGridNew/Editors/AfterEditorTemplate/AfterEditorTemplate';

export default class Demo extends Control {
    protected _template: TemplateFunction = template;
}
