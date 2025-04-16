/**
 * @kaizen_zone c4f41dc0-617f-4dae-a3e8-78fd94e09ce2
 */
import { IControlOptions } from 'UI/Base';
import { IInputData } from './Base/InputUtil';
import { ValueInField } from './FixBugs/ValueInField';
import { InsertFromDrop } from './FixBugs/InsertFromDrop';
import { MinusProcessing } from './FixBugs/MinusProcessing';
import {
    CarriagePositionWhenFocus,
    TUpdatePositionCallback,
} from './FixBugs/CarriagePositionWhenFocus';
import HeightAfterInput from './FixBugs/SafariHeightAfterInput';
import BaseViewModel from './BaseViewModel';
import { SyntheticEvent } from 'react';

interface IInst {
    _model: BaseViewModel<any, any>;
    _getField: () => HTMLInputElement;
}

interface IConfig {
    updatePositionCallback: TUpdatePositionCallback;
}

export class FixBugs {
    private _inst: IInst;
    private _valueInFieldBug: ValueInField;
    private _insertFromDropBug: InsertFromDrop;
    private _minusProcessingBug: MinusProcessing;
    private _carriagePositionBug: CarriagePositionWhenFocus;
    private _heightAfterInputInSafari: HeightAfterInput;

    constructor(config: IConfig, inst: IInst) {
        this._inst = inst;
        this._valueInFieldBug = new ValueInField();
        this._insertFromDropBug = new InsertFromDrop();
        this._minusProcessingBug = new MinusProcessing();
        this._carriagePositionBug = new CarriagePositionWhenFocus(config.updatePositionCallback);
        this._heightAfterInputInSafari = new HeightAfterInput();
    }

    beforeMount(): void {
        this._valueInFieldBug.beforeMount(this._inst._model.displayValue);
    }

    afterMount(): void {
        this._valueInFieldBug.afterMount();
    }

    beforeUpdate(oldOptions: IControlOptions, newOptions: IControlOptions): void {
        if (oldOptions.readOnly !== newOptions.readOnly) {
            this._carriagePositionBug.editingModeWasChanged(
                oldOptions.readOnly,
                newOptions.readOnly
            );
            this._valueInFieldBug.beforeUpdate(
                oldOptions.readOnly,
                newOptions.readOnly,
                this._inst._model.displayValue
            );
        }
    }

    afterUpdate(): void {
        this._valueInFieldBug.afterUpdate();
    }

    mouseDownHandler(): void {
        this._carriagePositionBug.mouseDownHandler();
    }

    focusHandler(event: SyntheticEvent<HTMLElement, FocusEvent>): void {
        this._insertFromDropBug.focusHandler(event);
        const positionChanged: boolean = this._carriagePositionBug.focusHandler();
        if (!positionChanged) {
            this._insertFromDropBug.cancel();
        }
    }

    dataForInputProcessing(data: IInputData): IInputData {
        let processingResult: IInputData;

        processingResult = this._insertFromDropBug.inputProcessing(data);
        processingResult = this._minusProcessingBug.inputProcessing(processingResult);

        this._valueInFieldBug.startInputProcessing();

        this._heightAfterInputInSafari.inputHandler(this._inst._getField(), data);

        return processingResult;
    }
}
