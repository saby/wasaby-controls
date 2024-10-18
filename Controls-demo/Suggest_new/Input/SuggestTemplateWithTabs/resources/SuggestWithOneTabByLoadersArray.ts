import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Suggest_new/Input/SuggestTemplateWithTabs/resources/SuggestWithOneTabByLoadersArray');

class SuggestTabTemplate extends Control {
    protected _template: TemplateFunction = controlTemplate;
}
export default SuggestTabTemplate;
