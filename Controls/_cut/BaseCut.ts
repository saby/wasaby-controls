/**
 * @kaizen_zone 4f556a12-3d12-4c5d-bfd8-53e193344358
 */
import { descriptor } from 'Types/entity';
import { Control, TemplateFunction } from 'UI/Base';
import { IBackgroundStyle, IExpandable } from 'Controls/interface';
import { ICutOptions } from './interface/ICut';
import { RESIZE_OBSERVER_BOX, ResizeObserverUtil } from 'Controls/sizeUtils';
import * as baseTemplate from 'wml!Controls/_cut/BaseCut/BaseCut';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as template from 'wml!Controls/_cut/Cut/Cut';
import 'css!Controls/cut';
import { detection } from 'Env/Env';
import { IECompatibleLineHeights } from 'Controls/input';

class BaseCut
    extends Control<ICutOptions>
    implements IBackgroundStyle, IExpandable
{
    protected _expanded: boolean = false;
    protected _cutHeight: number = null;

    protected _baseCutTemplate: TemplateFunction = baseTemplate;

    private _resizeObserver: ResizeObserverUtil;

    protected _isIE: boolean = detection.isIE11;
    protected _lineHeightForIE: Record<string, number> =
        IECompatibleLineHeights;
    protected _cutVisible: boolean;

    readonly '[Controls/_interface/IBackgroundStyle]': boolean = true;
    readonly '[Controls/_toggle/interface/IExpandable]': boolean = true;

    protected _beforeMount(options?: ICutOptions): void {
        if (options.hasOwnProperty('expanded')) {
            this._expanded = options.expanded === undefined ? false : options.expanded;
        }
    }

    protected _afterMount(options: ICutOptions): void {
        if (this._isIE) {
            this._cutVisible = this._calculateCutVisible();
        }
        if (this._hasResizeObserver()) {
            this._resizeObserver = new ResizeObserverUtil(
                this,
                this._resizeObserverCallback
            );
            this._resizeObserver.observe(
                this._children.content as HTMLElement,
                { box: RESIZE_OBSERVER_BOX.borderBox }
            );
        }
    }

    private _calculateCutVisible(): boolean {
        const contentHeight = this._children.content.offsetHeight;
        const containerHeight = this._container.offsetHeight;
        return contentHeight > containerHeight;
    }

    protected _hasResizeObserver(): boolean {
        return true;
    }

    protected _isChanged(entries: [ResizeObserverEntry]): boolean {
        // ResizeObserver выстрелит в первый раз после инициализации. Если кат изначально был открыт - его скроет.
        // Игнорируем первый вызов.
        if (this._cutHeight === null) {
            this._cutHeight =
                this._children.content.getBoundingClientRect().height;
            return false;
        }
        const entry = entries[0];
        let changed = false;
        if (this._cutHeight !== entry.contentRect.height) {
            this._cutHeight = entry.contentRect.height;
            changed = true;
        }
        return changed;
    }

    protected _resizeObserverCallback(entries: [ResizeObserverEntry]): void {
        if (this._expanded && this._isChanged(entries)) {
            this._expanded = false;
            this._notify('expandedChanged', [this._expanded]);
        }
    }

    protected _beforeUpdate(options?: ICutOptions): void {
        if (
            options.hasOwnProperty('expanded') &&
            (this._options.expanded !== options.expanded ||
                this._expanded !== options.expanded)
        ) {
            this._expanded = options.expanded;
        }
    }

    protected _afterUpdate(): void {
        if (detection.isIE) {
            this._cutVisible = this._calculateCutVisible();
        }
    }

    protected _beforeUnmount(): void {
        this._resizeObserver?.terminate();
    }

    protected _onExpandedChangedHandler(event: Event, expanded: boolean): void {
        if (!this._options.hasOwnProperty('expanded')) {
            this._expanded = expanded;
        }
        this._notify('expandedChanged', [expanded]);
    }

    static getOptionTypes(): object {
        return {
            backgroundStyle: descriptor(String),
        };
    }

    static getDefaultOptions(): object {
        return {
            backgroundStyle: 'default',
        };
    }
}

export default BaseCut;
