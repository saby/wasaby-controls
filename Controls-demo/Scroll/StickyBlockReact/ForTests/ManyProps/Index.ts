import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Scroll/StickyBlockReact/ForTests/ManyProps/Index');
import { RecordSet } from 'Types/collection';
import { SyntheticEvent } from 'UICommon/Events';
import 'css!Controls-demo/Scroll/StickyBlockReact/ForTests/ManyProps/Style';

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
    protected _offsetTopItems: RecordSet = new RecordSet({
        rawData: [
            {
                id: '0',
                caption: '0',
            },
            {
                id: '1',
                caption: '5',
            },
            {
                id: '2',
                caption: '-5',
            },
        ],
        keyProperty: 'id',
    });
    protected _modeSelectedKey: string = '0';
    protected _offsetTopSelectedKey: string = '0';
    protected _mode: string = 'replaceable';
    protected _offsetTop: number = 0;

    protected _modeKeyChanged(e: SyntheticEvent, selectedKey: string): void {
        if (selectedKey === '0') {
            this._mode = 'replaceable';
        } else if (selectedKey === '1') {
            this._mode = 'stackable';
        }
    }

    protected _offsetTopKeyChanged(e: SyntheticEvent, selectedKey: string): void {
        if (selectedKey === '0') {
            this._offsetTop = 0;
        } else if (selectedKey === '1') {
            this._offsetTop = 5;
        } else if (selectedKey === '2') {
            this._offsetTop = -5;
        }
    }
}
