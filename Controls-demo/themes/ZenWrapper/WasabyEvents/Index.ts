import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import * as wrappedTemplate from 'wml!Controls-demo/themes/ZenWrapper/WasabyEvents/WrappedTemplate';

import template = require('wml!Controls-demo/themes/ZenWrapper/WasabyEvents/Template');

export default class RenderDemo extends Control {
    protected _template: TemplateFunction = template;
    protected _wrappedTemplate: TemplateFunction = wrappedTemplate;
    protected _log: string[] = [];

    protected _contextMenuHandler(event: SyntheticEvent): void {
        event.stopPropagation();
        event.preventDefault();
        this._log.push(`handled ${event.type}`);
    }
}
