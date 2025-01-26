import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-ListEnv-demo/SuggestSearch/FooterTemplate/resources/FooterTemplate');

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _clickHandler(): void {
        this._children.stackOpener.open({ filter: {} });
    }

    static _styles: string[] = ['Controls-ListEnv-demo/SuggestSearch/Index'];
}
