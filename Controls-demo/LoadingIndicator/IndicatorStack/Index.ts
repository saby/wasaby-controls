import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/LoadingIndicator/IndicatorStack/IndicatorStack');

class IndicatorStack extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    private _firstId: number = null;
    private _secondId: number = null;
    private _overlayId: number = null;
    protected _firstOpen(): void {
        const cfg = {
            id: this._firstId,
            message: 'first indicator text',
            overlay: 'none',
            delay: 0,
        };
        this._firstId = this._notify('showIndicator', [cfg], {
            bubbling: true,
        }) as number;
    }
    protected _close(event: Event, name: string): void {
        const indicatorName = '_' + name + 'Id';
        if (this[indicatorName]) {
            this._notify('hideIndicator', [this[indicatorName]], {
                bubbling: true,
            });
            this[indicatorName] = null;
        }
    }
    protected _secondOpen(): void {
        const cfg = {
            id: this._secondId,
            overlay: 'none',
            message: 'second indicator text',
            delay: 0,
        };
        this._secondId = this._notify('showIndicator', [cfg], {
            bubbling: true,
        }) as number;
    }
    protected _overlay(): void {
        const delay = 3000;
        const promise = new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, delay);
        });
        const cfg = {
            id: this._overlayId,
            message: 'The indicator will close after ' + delay / 1000,
            delay: 0,
        };
        this._overlayId = this._notify('showIndicator', [cfg, promise], {
            bubbling: true,
        }) as number;
        this._interval(this._overlayId, delay);
    }
    private _interval(id: number, delay: number): void {
        setTimeout(() => {
            if (delay > 1000) {
                delay -= 1000;
                const cfg = {
                    id,
                    message: 'The indicator will close after ' + delay / 1000,
                    delay: 0,
                };
                this._overlayId = this._notify('showIndicator', [cfg], {
                    bubbling: true,
                }) as number;
                this._interval(this._overlayId, delay);
            } else {
                this._notify('hideIndicator', [this._overlayId], {
                    bubbling: true,
                });
            }
        }, 1000);
    }
}
export default IndicatorStack;
