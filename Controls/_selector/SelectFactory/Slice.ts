import { AbstractSlice } from 'Controls-DataEnv/slice';
import { RecordSet } from 'Types/collection';

/**
 * Интерфейс состояния слайса окна выбора
 * @private
 */
export interface ISelectSliceState {
    /**
     * Определяет, изменён ли выбора на окне
     */
    isSelectionChanged: boolean;
    /**
     * История выбора
     */
    history?: Record<string, RecordSet>;
}

/**
 * Интерфейс слайса окна выбора
 * @private
 */
export interface ISelectSlice {
    /**
     * Подтвердить выбор на окне выбора
     */
    submit(): Promise<unknown>;
    /**
     * Отметить запись
     */
    select(listName: string): void;
    /**
     * Исключить из отмеченных
     */
    exclude(listName: string): void;
}

/**
 * Контроллер (слайс) окна выбора
 * @public
 */
export default class SelectSlice extends AbstractSlice<ISelectSliceState> implements ISelectSlice {
    //@ts-ignore
    protected _initState(loadResult): ISelectSliceState {
        return loadResult as ISelectSliceState;
    }

    submit(): Promise<unknown> {
        return Promise.resolve();
    }

    select() {
        return;
    }

    exclude() {
        return;
    }
}
