import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/themes/ZenWrapper/Template');
import 'css!Controls-demo/themes/ZenWrapper/resources/Style';

class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
export default Index;
