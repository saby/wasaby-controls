import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import { Memory } from 'Types/source';
import { IDemoStepOptions } from './IDemoStepOptions';
import * as template from 'wml!Controls-Wizard-demo/vertical/WrappedLayout/VerticalStep2';

const STEP = 1;

export default class VerticalStep2 extends Control<IDemoStepOptions> {
    protected _template: TemplateFunction = template;
    protected _viewSource: Memory;
    protected _viewSource2: Memory;

    protected _beforeMount(options: IDemoStepOptions): void {
        const dataOptions = options.getDataOptions(STEP).data;
        this._viewSource = dataOptions.source;
        this._viewSource2 = dataOptions.source2;
    }

    protected _finishStepHandler(event: SyntheticEvent<Event>): void {
        this._options.finishStepHandler(event, STEP);
    }

    protected _stepBackHandler(event: SyntheticEvent<Event>): void {
        this._options.stepBackHandler(event, STEP);
    }
}
