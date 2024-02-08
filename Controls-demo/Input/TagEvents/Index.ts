import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/TagEvents/TagEvents');

class TagEvents extends Control<IControlOptions> {
    protected _placeholder: string = 'Tooltip';

    protected _template: TemplateFunction = controlTemplate;

    protected _showInfoBox(event: Event, tag: HTMLElement): void {
        const config = {
            target: tag,
            message: 'Hello world!!!',
        };

        this._notify('openInfoBox', [config], { bubbling: true });
    }
}
export default TagEvents;
