import { Model } from 'Types/entity';
import IItemsStrategy, { IOptions as IItemsStrategyOptions } from '../IItemsStrategy';
import CollectionItem from '../CollectionItem';

// Абстрактная стратегия, которая прокидывает вызовы в source
export default abstract class Proxy<
    S extends Model = Model,
    T extends CollectionItem<S> = CollectionItem<S>,
    TOptions extends IItemsStrategyOptions<S, T> = IItemsStrategyOptions<S, T>
> implements IItemsStrategy<S, T>
{
    readonly '[Controls/_display/IItemsStrategy]': boolean;

    /**
     * Опции конструктора
     */
    protected _options: TOptions;

    count: number;

    get source(): IItemsStrategy<S, T> {
        return this._options.source as IItemsStrategy<S, T>;
    }

    get options(): TOptions {
        return this.source.options as TOptions;
    }

    constructor(options: TOptions) {
        this._options = options;
    }

    splice(start: number, deleteCount: number, added?: S[]): T[] {
        return this.source.splice(start, deleteCount, added);
    }

    reset(): void {
        return this.source.reset();
    }

    invalidate(): void {
        return this.source.invalidate();
    }

    abstract at(index: number): T;

    abstract getCollectionIndex(index: number): number;

    abstract getDisplayIndex(index: number): number;
}
