import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { Controller, IRouteModel } from 'Controls/hintManager';
import * as template from 'wml!Controls-demo/HintManager/CustomEntityContent/CustomEntityContent';
import {
    getRoute,
    getCycleRoute,
    getOnlyHighlightRoute,
    getRouteWithOnBeforeOpenCallback
} from 'Controls-demo/HintManager/mockedData/routesMockedData';
import type { Model } from 'Types/entity';
import 'css!Controls-demo/HintManager/CustomEntityContent/CustomEntityContent';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    private _controller: Controller | null;

    protected _activateRoute(): void {
        const route = getRoute();
        this._activate(route);
    }

    protected _activateCycleRoute(): void {
        const route = getCycleRoute();
        this._activate(route);
    }

    protected _activateOnlyHighlightRoute(): void {
        const route = getOnlyHighlightRoute();
        this._activate(route);
    }

    protected _activateRouteWithOnBeforeOpenCallback(): void {
        const route = getRouteWithOnBeforeOpenCallback();
        this._activate(route);
    }

    protected _activate(route: Model<IRouteModel>): void {
        this._destroy();

        this._controller = new Controller(route);
        this._controller.activate();
    }

    protected _destroy(): void {
        this._controller?.destroy();
        this._controller = null;
    }

    protected _nextStep(): void {
        this._controller?.next();
    }

    protected _prevStep(): void {
        this._controller?.prev();
    }
};
