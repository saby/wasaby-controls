import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { Controller, IRouteModel, IStepModel } from 'Controls/hintManager';
import * as template from 'wml!Controls-demo/HintManager/HighlighterOffset/HighlighterOffset';
import { getRouteForHighlighterOffsetSetting } from 'Controls-demo/HintManager/mockedData/routesMockedData';
import type { Model } from 'Types/entity';
import 'css!Controls-demo/HintManager/HighlighterOffset/HighlighterOffset';

const INITIAL_HIGHLIGHTER_OFFSET = 2;

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    protected _offsetTop: number = INITIAL_HIGHLIGHTER_OFFSET;
    protected _offsetRight: number = INITIAL_HIGHLIGHTER_OFFSET;
    protected _offsetBottom: number = INITIAL_HIGHLIGHTER_OFFSET;
    protected _offsetLeft: number = INITIAL_HIGHLIGHTER_OFFSET;

    private _controller: Controller | null;

    protected _beforeUnmount(): void {
        this._controller?.destroy();
    }

    protected _applyHighlighterOffsetToRoute(): void {
        if (this._controller) {
            const route = this._controller.getRoute();
            const step = route.get('scheme').at(0);
            this._setHighlighterOffset(step);
            this._controller.openStep(step.get('id'));
        } else {
            const route = getRouteForHighlighterOffsetSetting();
            this._setHighlighterOffset(route.get('scheme').at(0));
            this._activate(route);
        }
    }

    private _setHighlighterOffset(step: Model<IStepModel>): void {
        const display = step.get('display');
        display.highlighterOffset = {
            top: this._offsetTop,
            right: this._offsetRight,
            bottom: this._offsetBottom,
            left: this._offsetLeft,
        };
        step.set('display', display);
    }

    protected _activate(route: Model<IRouteModel>): void {
        this._controller = new Controller(route);
        this._controller.activate();
    }
};
