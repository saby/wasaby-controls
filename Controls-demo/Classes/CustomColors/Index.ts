import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Classes/CustomColors/Template');
import 'css!Controls-demo/Classes/CustomColors/Style';

class ViewModes extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _numCategories: number = 5;
    protected _numColors: number = 13;
    protected _selectedValue: string = '';

    protected _onColorClick(event: Event, color: string, category: string): void {
        this._selectedValue = '--palette_color' + color + '_' + category;
    }
}

export default ViewModes;
