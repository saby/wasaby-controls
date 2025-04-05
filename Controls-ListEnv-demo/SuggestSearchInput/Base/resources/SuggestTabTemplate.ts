import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/SuggestSearchInput/Base/resources/SuggestTabTemplate';

export default class extends Control {
    protected _template: TemplateFunction = template;
}
