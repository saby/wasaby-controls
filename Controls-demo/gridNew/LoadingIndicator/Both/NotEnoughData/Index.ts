import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/LoadingIndicator/Both/NotEnoughData/NotEnoughData';

export default class extends Control {
    protected _template: TemplateFunction = Template;
}
