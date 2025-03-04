import { Control, TemplateFunction } from 'UI/Base';
import Template = require('wml!Controls-demo/PopupTemplate/Sticky/backgroundStyle/Template');
import 'css!Controls-demo/PopupTemplate/Sticky/Sticky';

class Index extends Control {
    protected _template: TemplateFunction = Template;
}
export default Index;
