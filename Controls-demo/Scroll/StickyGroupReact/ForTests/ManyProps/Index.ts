import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Scroll/StickyGroupReact/ForTests/ManyProps/Index');
import { RecordSet } from 'Types/collection';
import { SyntheticEvent } from 'UICommon/Events';
import 'css!Controls-demo/Scroll/StickyGroupReact/ForTests/ManyProps/Style';

export default class ManyProps extends Control<IControlOptions> {
    readonly _template: TemplateFunction = controlTemplate;

    protected _modeItems: RecordSet = new RecordSet({
        rawData: [
            {
                id: '0',
                caption: 'replaceable',
            },
            {
                id: '1',
                caption: 'stackable',
            },
        ],
        keyProperty: 'id',
    });
    protected _modeSelectedKey: string = '0';
    protected _mode: string = 'replaceable';

    protected _modeKeyChanged(e: SyntheticEvent, selectedKey: string): void {
        if (selectedKey === '0') {
            this._mode = 'replaceable';
        } else if (selectedKey === '1') {
            this._mode = 'stackable';
        }
    }
}
