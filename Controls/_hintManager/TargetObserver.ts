/**
 * @kaizen_zone 6ccf0789-a238-4656-86f6-d0eff65e12f9
 */

/**
 * Класс, осуществляющий наблюдение за присутствием в верстке текущего таргета подсказки.
 * @class Controls/_hintManager/TargetObserver
 * @public
 */
class TargetObserver {
    private _currentTarget: HTMLElement | null;

    private _domObserver: MutationObserver | null;

    constructor(targetDeletionCallback: Function) {
        this._subscribeToMutation(targetDeletionCallback);
    }

    /**
     * Метод отписывается от изменений в DOM и очищает текущий таргет подсказки.
     */
    destroy(): void {
        this._unsubscribeToMutation();
        this._currentTarget = null;
    }

    /**
     * Метод устанавливает текущий таргет подсказки.
     * @param {?HTMLElement} target Текущий таргет подсказки.
     */
    setCurrentHintTarget(target: HTMLElement | null): void {
        this._currentTarget = target;
    }

    private _subscribeToMutation(targetDeletionCallback: Function): void {
        if (!this._domObserver && 'MutationObserver' in window) {
            this._domObserver = new MutationObserver(this._targetDeletionHandler.bind(this, targetDeletionCallback));
            this._domObserver.observe(document, {
                childList: true,
                subtree: true
            });
        }
    }

    private _unsubscribeToMutation(): void {
        if (this._domObserver) {
            this._domObserver.disconnect();
            this._domObserver = null;
        }
    }

    private _targetDeletionHandler(targetDeletionCallback: Function): void {
        if (this._currentTarget && !document.body.contains(this._currentTarget)) {
            this._currentTarget = null;
            targetDeletionCallback();
        }
    }
}

export default TargetObserver;
