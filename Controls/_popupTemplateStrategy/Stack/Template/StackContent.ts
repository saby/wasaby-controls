/**
 * @kaizen_zone 05aea820-650e-420c-b050-dd641a32b2d5
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_popupTemplateStrategy/Stack/Template/StackContent/StackContent';
import { EventUtils } from 'UI/Events';
import { controller } from 'I18n/i18n';

interface IStackContentOptions extends IControlOptions {
    currentMaxWidth?: number;
    currentMinWidth?: number;
    currentWidth?: number;
}

class StackContent extends Control<IStackContentOptions> {
    protected _template: TemplateFunction = template;
    protected _tmplNotify: Function = EventUtils.tmplNotify;
    protected _minOffset: number;
    protected _maxOffset: number;
    protected _resizeDirection: string;

    protected _close(event): void {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        this._notify('close', [], { bubbling: true });
    }

    protected _beforeMount(options: IStackContentOptions): void {
        this._updateOffset(options);
        this._resizeDirection =
            controller.currentLocaleConfig.directionality === 'rtl' ? 'direct' : 'reverse';
    }

    protected _beforeUpdate(options: IStackContentOptions): void {
        this._updateOffset(options);
    }

    protected _popupMovingSizeHandler(event, value) {
        this._notify('popupMovingSize', [value]);
        this._notify('controlResize', [], { bubbling: true });
    }

    protected _canResize(
        propStorageId: string,
        width: number,
        minWidth: number,
        maxWidth: number
    ): boolean {
        const canResize =
            !this.props.fullscreen &&
            propStorageId &&
            width &&
            minWidth &&
            maxWidth &&
            maxWidth !== minWidth;
        return !!canResize;
    }

    private _updateOffset(options: IStackContentOptions): void {
        // protect against wrong options
        this._maxOffset = Math.max(options.currentMaxWidth - options.currentWidth, 0);
        this._minOffset = Math.max(options.currentWidth - options.currentMinWidth, 0);
    }
}

export default StackContent;
