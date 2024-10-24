import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/progress/Rating/Template';

class Rating extends Control<IControlOptions> {
    protected _template: TemplateFunction = Template;
}

export default Rating;
