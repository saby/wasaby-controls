import { Control, TemplateFunction } from 'UI/Base';
import Template = require('wml!Controls-demo/PopupTemplate/Sticky/HeaderCaption/Template');

class Index extends Control {
    protected _template: TemplateFunction = Template;

    static _styles: string[] = ['Controls-demo/PopupTemplate/Sticky/Sticky'];
}
export default Index;
