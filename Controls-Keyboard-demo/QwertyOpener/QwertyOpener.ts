import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-Keyboard-demo/QwertyOpener/QwertyOpener';

export default class DemoQwerty extends Control {
    protected _template: TemplateFunction = template;
    protected _searchString: string;

    static _styles: string[] = ['Controls-Keyboard-demo/QwertyOpener/QwertyOpener'];
}
