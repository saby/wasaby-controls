import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/themes/Wrapper/Template');

class Index extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _variables: object = {
        '--primary_text-color': 'pink',
        '--secondary_text-color': 'violet',
        '--text-color': 'yellow',
    };
}
export default Index;
