import { Control, TemplateFunction } from 'UI/Base';

import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/MenuIconSize/MenuIconSize';

export default class extends Control {
    protected _template: TemplateFunction = Template;
}
