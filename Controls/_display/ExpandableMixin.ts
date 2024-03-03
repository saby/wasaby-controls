/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
export interface IOptions {
    expanded?: boolean;
}

/**
 * Mixin that defines expandable aspect in collection item behaviour.
 * @mixin Controls/_display/ExpandableMixin
 * @private
 */
export default abstract class ExpandableMixin {
    '[Controls/_display/ExpandableMixin]': boolean;
    readonly Expandable: boolean;

    /**
     * The node is expanded or collapsed. Expanded by default.
     */
    protected _$expanded: boolean;

    protected constructor() {
        ExpandableMixin.initMixin(this);
    }

    static initMixin(instance) {
        instance.Expandable = true;
        instance._$expanded = !!instance._$expanded;
    }

    /**
     * Returns node state is expanded.
     */
    isExpanded(): boolean {
        return this._$expanded;
    }

    /**
     * Sets node state as expanded or collapsed.
     * @param expanded True if node is expanded, otherwise collapsed
     * @param [silent=false] Do not fire event about node's state change
     */
    setExpanded(expanded: boolean, silent?: boolean): void {
        if (this._$expanded === expanded) {
            return;
        }
        this._$expanded = expanded;
        this._nextVersion();
        if (!silent) {
            if (this._notifyItemChangeToOwner) {
                this._notifyItemChangeToOwner('expanded');
            }
        } else if (this._notify) {
            this._notify('stateChanged', 'expanded');
        }
    }

    /**
     * Switches node state from expanded to collapsed and vice versa.
     */
    toggleExpanded(): void {
        this.setExpanded(!this.isExpanded());
    }

    // region Controls/_display/CollectionItem

    protected abstract _notifyItemChangeToOwner(property: string): void;

    protected abstract _nextVersion(): void;

    protected abstract _notify(event: string, ...args: any[]): any;

    // endregion
}

Object.assign(ExpandableMixin.prototype, {
    '[Controls/_display/ExpandableMixin]': true,
    _$expanded: true,
});
