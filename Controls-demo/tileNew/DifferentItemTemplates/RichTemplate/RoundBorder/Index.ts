import { Control, TemplateFunction } from 'UI/Base';

import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/RoundBorder/RoundBorder';

export default class extends Control {
    protected _template: TemplateFunction = Template;
}
