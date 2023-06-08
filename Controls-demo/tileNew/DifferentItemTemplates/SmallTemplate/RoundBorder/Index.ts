import { Control, TemplateFunction } from 'UI/Base';

import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/SmallTemplate/RoundBorder/RoundBorder';

export default class extends Control {
    protected _template: TemplateFunction = Template;
}
