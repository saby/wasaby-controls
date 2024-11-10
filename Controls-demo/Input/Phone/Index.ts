import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Input/Phone/Phone');

class Phone extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
    protected _copyItems: object[];

    protected _beforeMount(): void {
        this._copyItems = [
            {
                id: 'copy1',
                caption: 'Строка 1',
                text: '123\n90',
            },
            {
                id: 'copy2',
                caption: 'Строка 2',
                text: '+74+95+',
            },
            {
                id: 'copy3',
                caption: 'Строка 3',
                text: '7495123',
            },
            {
                id: 'copy4',
                caption: 'Строка 4',
                text: '8 (980) 124-54-21',
            },
            {
                id: 'copy5',
                caption: 'Строка 5',
                text: '89099999999',
            },
            {
                id: 'copy6',
                caption: 'Строка 6',
                text: '88112455555',
            },
        ];
    }

    _copyClickHandler(event: Event, childrenName: string): void {
        this._copy(this._children[childrenName] as Element);
    }

    protected _copy(container: Element): void {
        const selection = getSelection();
        selection.removeAllRanges();
        const range = document.createRange();
        range.selectNodeContents(container);
        selection.addRange(range);
        document.execCommand('copy');
        selection.removeAllRanges();
    }
}

export default Phone;
