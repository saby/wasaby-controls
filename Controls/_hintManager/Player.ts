/**
 * @kaizen_zone 6ccf0789-a238-4656-86f6-d0eff65e12f9
 */
import { StickyOpener } from 'Controls/popup';
import { getClosestControl } from 'UI/NodeCollector';
import { default as Highlighter } from 'Controls/_hintManager/Highlighter';
import { default as TargetObserver } from 'Controls/_hintManager/TargetObserver';
import { getTargetById } from 'Controls/_hintManager/Utils/TargetUtils';
import type { Model } from 'Types/entity';
import { IStepModel, IStepDisplay, IHighlighterOffset } from 'Controls/_hintManager/interface/IStepModel';

/**
 * Плеер маршрутов подсказок.
 * @public
 */
class Player {
    private _currentHintArea: HTMLElement | null;

    private _highlighter: Highlighter;
    private _targetObserver: TargetObserver;
    private _stickyOpener: StickyOpener;

    /**
     * Метод разрушает экземпляр класса плеера маршрутов подсказок.
     */
    destroy(): void {
        if (this._currentHintArea) {
            this._currentHintArea = null;
        }
        if (this._highlighter) {
            this._highlighter.destroy();
            this._highlighter = null;
        }
        if (this._targetObserver) {
            this._targetObserver.destroy();
            this._targetObserver = null;
        }
        if (this._stickyOpener) {
            this._stickyOpener.destroy();
            this._stickyOpener = null;
        }
    }

    /**
     * Метод активирует режим просмотра маршрута подсказок.
     */
    activateViewMode(routeId: string): void {
        this.initCurrentHintArea();
        this._highlighter = new Highlighter(routeId);
        this._highlighter.createTargetHighlighter();
        this._targetObserver = new TargetObserver(this._targetDeletionCallback.bind(this));
    }

    /**
     * Метод прерывает режим просмотра маршрута подсказок.
     */
    abortViewMode(): void {
        this._closeStepPopup();
        this._highlighter?.removeHighlight();
        this._targetObserver?.setCurrentHintTarget(null);
    }

    /**
     * Метод инициализирует область просмотра маршрута подсказок.
     */
    initCurrentHintArea(): void {
        // TODO: Проработать выбор области просмотра только на основе идентификатора сущности
        this._currentHintArea = document;
    }

    /**
     * Метод показывает шаг маршрута.
     * @param {Types/entity:Model} step Шаг маршрута.
     * @param {Boolean} [isOnlyHighlightAllowed] Признак отображения выделения целевого элемента без окна подсказки.
     */
    showStep(step: Model<IStepModel>, isOnlyHighlightAllowed?: boolean): void {
        const stepDisplay = step.get('display');
        const { targetId, highlighterOffset } = stepDisplay;
        const target = this._getTarget(stepDisplay);

        if (step.get('message') || step.get('widgets')) {
            this._openStepPopup(step, target, !targetId);
        } else if (targetId && isOnlyHighlightAllowed) {
            this._highlightTarget(target, highlighterOffset);
        }
    }

    private _getTarget(stepDisplay: IStepDisplay): HTMLElement | null {
        const { targetId, targetSearchAreaSelector } = stepDisplay;
        let target;

        if (targetId) {
            const targetSearchArea = targetSearchAreaSelector ? document.querySelector(targetSearchAreaSelector) :
                                                                this._currentHintArea;
            target = getTargetById(targetId, targetSearchArea as HTMLElement);
        } else {
            target = this._currentHintArea;
        }

        return target;
    }

    private _openStepPopup(step: Model<IStepModel>, target: HTMLElement, isBanner: boolean): void {
        // Таргет подсказки мог удалиться из верстки в результате действия по клику на кнопку предыдущей подсказки.
        if (!target) {
            return;
        }

        let popupTarget = target;
        let opener = null;

        if (!isBanner) {
            this._highlighter.update(target, step.get('display').highlighterOffset);

            // В качестве таргета всплывающего окна используется выделяющий элемент, а не сам target:
            // 1. Для того, чтобы позиционирование окна учитывало прикладные настройки смещения выделяющего элемента.
            // 2. Для корректного позиционирования окна при скролле target-а внутри родительского контейнера с
            // overflow: hidden;
            popupTarget = this._highlighter.getTargetHighlighter();

            // opener указывается для того, чтобы при отображении подсказки на элементе во всплывающем окне, которое
            // закрывается по клику вне этого окна, взаимодействие с подсказкой не приводило к закрытию окна.
            opener = getClosestControl(target as unknown as HTMLElement);
        }

        if (!this._stickyOpener) {
            this._stickyOpener = new StickyOpener();
        }
        this._stickyOpener.open({
            target: popupTarget,
            opener,
            actionOnScroll: 'track',
            trackTarget: true,
            template: 'Controls/hintManagerPopup:Message',
            templateOptions: {
                // TODO: Реализовать настройку стиля фона и границы подсказки.
                backgroundStyle: 'info',
                borderStyle: 'info',
                message: step.get('message')
            },
            // TODO: Реализовать настройку размеров и позиционирования окна подсказки.
            direction: {
                horizontal: 'center',
                vertical: 'top'
            },
            targetPoint: {
                horizontal: 'center',
                vertical: 'top'
            },
            eventHandlers: {
                onClose: this._stepCloseHandler.bind(this, target)
            }
        }).then(() => {
            if (!isBanner) {
                this._highlighter.addHighlightToTarget(target);
                this._targetObserver.setCurrentHintTarget(target);
            }
        });
    }

    private _highlightTarget(target: HTMLElement, highlighterOffset?: IHighlighterOffset): void {
        // Таргет подсказки мог удалиться из верстки в результате действия по клику на кнопку предыдущей подсказки.
        if (!target) {
            return;
        }

        this._highlighter.update(target, highlighterOffset);
        this._highlighter.addHighlightToTarget(target);
        this._targetObserver.setCurrentHintTarget(target);
    }

    private _closeStepPopup(): void {
        if (this._stickyOpener) {
            this._stickyOpener.close();
        }
    }

    private _stepCloseHandler(target: HTMLElement): void {
        this._highlighter?.removeHighlightFromTarget(target);
        this._targetObserver?.setCurrentHintTarget(null);
    }

    private _targetDeletionCallback(): void {
        this.abortViewMode();
    }
}

export default Player;
