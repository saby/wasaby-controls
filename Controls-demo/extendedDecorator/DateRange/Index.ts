import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/extendedDecorator/DateRange/Index';
import { TimeIntervalDisplayMode, ITimeIntervalUnits } from 'Types/formatter';
import { Memory } from 'Types/source';
import { SyntheticEvent } from 'Vdom/Vdom';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    protected _startValue: Date = new Date(2023, 1, 1, 1, 1, 1);
    protected _endValue: Date = new Date(2023, 1, 1, 1, 2, 15);
    protected _startValue1: Date = new Date(2023, 1, 1);
    protected _endValue1: Date = new Date(2023, 1, 1, 1, 0, 5);
    protected _startValue2: Date = new Date(2023, 1, 1, 1, 0, 10);
    protected _endValue2: Date = new Date(2023, 1, 4);
    protected _startValue3: Date = new Date(2022, 1, 1, 1, 1, 1);
    protected _endValue3: Date = new Date(2023, 2, 2, 2, 2, 2);

    protected _displayMode: TimeIntervalDisplayMode = TimeIntervalDisplayMode.Numeric;
    protected _displayModeKey: number = 1;
    protected _displayModeSource: Memory = new Memory({
        keyProperty: 'key',
        data: [
            { key: 1, title: 'Numeric' },
            { key: 2, title: 'Literal' },
            { key: 3, title: 'Mixed' },
        ],
    });
    protected _displayedUnitsNumber: number;
    protected _displayedUnitsNumberKey: number = 1;
    protected _displayedUnitsNumberSource: Memory = new Memory({
        keyProperty: 'key',
        data: [
            { key: 1, title: 'undefined' },
            { key: 2, title: '2' },
        ],
    });
    protected _displayedUnits: ITimeIntervalUnits;
    protected _displayedUnitsKey: number = 1;
    protected _displayedUnitsSource: Memory = new Memory({
        keyProperty: 'key',
        data: [
            { key: 1, title: 'undefined' },
            { key: 2, title: '{ seconds: false }' },
        ],
    });
    protected _showNullUnits: boolean = false;
    protected _short: boolean = true;

    protected _displayModeChangeHandler(e: SyntheticEvent, key: number): void {
        this._displayModeKey = key;
        switch (key) {
            case 1: {
                this._displayMode = TimeIntervalDisplayMode.Numeric;
                break;
            }
            case 2: {
                this._displayMode = TimeIntervalDisplayMode.Literal;
                break;
            }
            case 3: {
                this._displayMode = TimeIntervalDisplayMode.Mixed;
                break;
            }
        }
    }

    protected _displayedUnitsNumberChangeHandler(e: SyntheticEvent, key: number): void {
        this._displayedUnitsNumberKey = key;
        this._displayedUnitsNumber = key === 1 ? undefined : 2;
    }

    protected _displayedUnitsChangeHandler(e: SyntheticEvent, key: number): void {
        this._displayedUnitsKey = key;
        this._displayedUnits = key === 1 ? undefined : { seconds: false };
    }
}
