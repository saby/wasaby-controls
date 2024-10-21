import { TExplorerViewMode } from 'Controls/explorer';
import View from 'Controls/_explorer/View';
import { Path } from 'Controls/dataSource';
import { Model } from 'Types/entity';

export interface IExplorerState {
    isGoingBack: boolean;
}

/**
 * Класс для тестов. Расширяет Controls.explorer:View и предоставляет методы для управления состоянием explorer.
 */
export class TestExplorer extends View {
    constructor() {
        super({});
    }

    /**
     * Возвращает текущее состояние explorer
     */
    getState(): IExplorerState {
        return {
            isGoingBack: this._isGoingBack,
        };
    }

    // region Методы, которые задают состояние Explorer без вызова доп. обработчиков
    /**
     * Задает новый режим отображения данных
     */
    setViewMode(viewMode: TExplorerViewMode): void {
        this._options.viewMode = viewMode;
    }

    /**
     * Задает текущее значение крошек для Explorer
     */
    setBreadcrumbs(breadcrumbs: Path): void {
        this._breadcrumbs = breadcrumbs;
    }
    // endregion

    // region Методы, которые меняют состояние Explorer с полной логикой обработки.
    /**
     * Вызывает ф-ию обработчик изменения хлебных крошек
     */
    changeBreadcrumbs(newBreadcrumbs: Path): void {
        this._onBreadcrumbsChanged(newBreadcrumbs);
    }
    // endregion
}

/**
 * Генерирует данные хлебных крошек с заданным кол-ом итемов
 */
export function generatePath(length: number): Model[] {
    const result = [];

    for (let id = 1; id <= length; id++) {
        result.push(
            new Model({
                keyProperty: 'id',
                rawData: { id },
            })
        );
    }

    return result;
}
