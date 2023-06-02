/**
 * @kaizen_zone e3c66493-0989-49a4-84b9-b069b273461d
 */
import { getDimensions } from 'Controls/sizeUtils';
import { IntersectionObserverSyntheticEntry } from 'Controls/scroll';
import { IEdgesData } from 'Controls/_stickyEnvironment/interfaces';

type CallbackType<T> = (pinnedData: T) => void;

interface IStackItem<T = unknown> {
    data: T;
    element: HTMLElement;
}

interface IPinControllerCfg<T = unknown> {
    /**
     * Обработчик, который вызывается при обновлении пограничных данных относительно
     * верхней и/или нижней границ корневого элемента.
     */
    onEdgesDataChanged?: (data: IEdgesData<T>) => void;
}

/**
 * Внутренний контроллер, который хранит стек данных, положение которых нужно отслеживать относительно
 * нижней или верхней границы ScrollContainer.
 * @private
 */
export class PinController<T = unknown> {
    // Внутренний стек данных, который собираем на основании события пересечения
    // их элементов с нижней или верхней границами ScrollContainer
    private _stack: IStackItem<T>[] = [];

    // Обработчики, которые должны быть вызваны
    // при смене верхних граничных данных
    private _callbacks: CallbackType<T>[] = [];

    constructor(private _cfg: IPinControllerCfg<T>) {}

    subscribe(callback: CallbackType<T>): void {
        this._callbacks.push(callback);
    }

    unsubscribe(callback: CallbackType<T>): void {
        const index = this._callbacks.indexOf(callback);
        if (index >= 0) {
            this._callbacks.splice(index, 1);
        }
    }

    /**
     * Временный метод для очистики стека закрепленных итемов.
     * Понадобился как быстрое решение вот этой проблемы
     * https://online.sbis.ru/opendoc.html?guid=a17584db-5cc5-429f-b975-c18dbc52e601
     */
    clearStack(): void {
        this._stack = [];
        this.processIntersect({} as IntersectionObserverSyntheticEntry);
    }

    /**
     * Выкидывает переданные данные из стека если они там есть.
     */
    dropStackItem(data: T): void {
        const index = this._stack.findIndex((item) => {
            return item.data === data;
        });

        if (index >= 0) {
            this._stack.splice(index, 1);
        }
    }

    /**
     * Обработчик появления/скрытия целевых элементов в области видимости корневого элемента.
     * 1. Обновляет внутренний стек данных в соответствии с тем порядком в котором они идут в разметке.
     * 2. Обновляет информация о пограничных данных для верхней и нижней границ
     */
    processIntersect(entry: IntersectionObserverSyntheticEntry): void {
        // Если данных нет, то и обрабатывать нечего. Это какой-то левый элемент.
        if (!entry.data) {
            return;
        }

        // 1. Обновим стек данных
        this.updateStack(entry);
        // 2. Пересчитаем пограничные данные для верхней и нижней границ
        const edgesData = this.getEdgesData(entry.nativeEntry.rootBounds);

        this._callbacks.forEach((callback) => {
            callback(edgesData.top.above);
        });

        if (this._cfg.onEdgesDataChanged) {
            this._cfg.onEdgesDataChanged(edgesData);
        }
    }

    /**
     * Обновляет стек элементов с которыми отслеживается пересечение.
     * На основании верхнего смещения элемента вставляет его в соответсвующее место стека.
     */
    private updateStack(entry: IntersectionObserverSyntheticEntry): void {
        const data = entry.data as unknown as T;
        // Пропускаем запись если она уже есть в стеке.
        if (
            this._stack.findIndex((item) => {
                return item.data === data;
            }) >= 0
        ) {
            return;
        }

        let targetIndex;
        const element = entry.nativeEntry.target as HTMLElement;
        // getBoundingClientRect для элемента списка, который пересек границы ScrollContainer
        const targetBounds = getDimensions(element);
        const lastStackElem =
            this._stack.length && this._stack[this._stack.length - 1].element;

        // Сразу проверим целевой элемент относительно последнего элемента стека
        // что бы не перебирать его весь. Т.к. обычно данный загружаются либо в конец списка либо в начало
        if (
            lastStackElem &&
            getDimensions(lastStackElem).top < targetBounds.top
        ) {
            this._stack.push({ data, element });
            return;
        }

        // Пробегаемся по стеку и ищем первый элемент верхняя границы которого выше
        // верхней границы текущего элемента, пересечение которого обрабатываем
        for (targetIndex = 0; targetIndex < this._stack.length; targetIndex++) {
            const stackElementDimensions = getDimensions(
                this._stack[targetIndex].element
            );

            if (stackElementDimensions.top > targetBounds.top) {
                break;
            }
        }

        this._stack.splice(targetIndex, 0, { data, element });
    }

    /**
     * На основании текущих данных стека вычисляет какие из них находятся ближе всего
     * к верхней и нижней границе корневого элемента.
     */
    private getEdgesData(rootBounds: DOMRectReadOnly): IEdgesData<T> {
        let aboveTop: T;
        let bellowTop: T;
        let aboveBottom: T;
        let belowBottom: T;

        for (let i = 0; i < this._stack.length; i++) {
            const stackItem = this._stack[i];
            const targetBounds = getDimensions(stackItem.element);

            if (targetBounds.top < rootBounds.top) {
                aboveTop = stackItem.data;
            }

            if (!bellowTop && targetBounds.top >= rootBounds.top) {
                bellowTop = stackItem.data;
            }

            if (targetBounds.top < rootBounds.bottom) {
                aboveBottom = stackItem.data;
            }

            if (!belowBottom && targetBounds.top >= rootBounds.bottom) {
                belowBottom = stackItem.data;
                break;
            }
        }

        return {
            top: {
                above: aboveTop,
                below: bellowTop,
            },
            bottom: {
                above: aboveBottom,
                below: belowBottom,
            },
        };
    }
}
