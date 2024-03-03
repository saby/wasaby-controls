import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { RecordSet } from 'Types/collection';

import * as template from 'wml!Controls-Actions/_commands/CreateMeeting/MeetingRegulationEditor';

export type TRegulation = 'meeting' | 'video';

interface IRegulationItem {
    id: TRegulation;
}

interface IOptions extends IControlOptions {
    propertyValue?: TRegulation;
}

export default class MeetingRegulationEditor extends Control<IOptions> {
    protected _template: TemplateFunction = template;
    protected _selectedKey: TRegulation;
    protected _items: RecordSet<IRegulationItem> = new RecordSet({
        rawData: [
            {
                id: 'meeting',
                title: 'Совещание',
            },
            {
                id: 'video',
                title: 'Видеосовещание',
            },
        ],
        keyProperty: 'id',
    });

    protected _beforeMount({ propertyValue }: IOptions): void {
        this._selectedKey = propertyValue;
    }

    protected _selectedKeyChangedHandler(_: Event, selectedKey: string[]): void {
        this._notify('propertyValueChanged', [selectedKey], { bubbling: true });
    }
}
