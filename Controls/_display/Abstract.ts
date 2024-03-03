/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import { DestroyableMixin, ObservableMixin, VersionableMixin } from 'Types/entity';
import {
    EnumeratorCallback,
    IEnumerable as IEnumerableCollection,
    IEnumerator,
    RecordSet,
} from 'Types/collection';
import { create } from 'Types/di';
import { mixin } from 'Types/util';
import { ISourceCollection } from 'Controls/_display/interface/ICollection';
import InitStateByOptionsMixin from 'Controls/_display/InitStateByOptionsMixin';
import FlatDataStrategy, { IDataStrategy } from './dataStrategy/FlatDataStrategy';

/**
 * Массив соответствия индексов проекций и коллекций
 */
const displaysToCollections: (IEnumerable<any> | any[])[] = [];

/**
 * Массив соответствия индексов проекций и их инстансов
 */
const displaysToInstances: Abstract<any, any>[] = [];

/**
 * Счетчик ссылок на singlton-ы
 */
const displaysCounter: number[] = [];

export interface IEnumerable<T> extends IEnumerableCollection<T> {
    getEnumerator(localize?: boolean): IEnumerator<T>;
    each(callback: EnumeratorCallback<T>, context?: object, localize?: boolean): void;
}

export interface IOptions<S> {
    collection: RecordSet<S> | S[];
    keyProperty: string;
}

/**
 * Абстрактная проекция данных.
 * @remark
 * Это абстрактный класс, не предназначенный для создания самостоятельных экземпляров.
 *
 * @mixes Types/entity:DestroyableMixin
 * @mixes Types/entity:OptionsMixin
 * @mixes Types/entity:ObservableMixin
 * @mixes Types/entity:VersionableMixin
 * @public
 */
export default abstract class Abstract<S, T> extends mixin<
    DestroyableMixin,
    InitStateByOptionsMixin,
    ObservableMixin,
    VersionableMixin
>(DestroyableMixin, InitStateByOptionsMixin, ObservableMixin, VersionableMixin) {
    /**
     * @cfg {Types/_collection/IEnumerable} Оригинальная коллекция
     * @name Controls/_display/Collection#collection
     * @see getSourceCollection
     */
    private _$collection: ISourceCollection<S>;

    /**
     * @cfg {String} Название свойства элемента коллекции, содержащего его уникальный идентификатор.
     * @name Controls/_display/Collection#keyProperty
     */
    private _$keyProperty: string;

    private _dataStrategy: IDataStrategy;

    protected _moduleName: string;

    constructor(options?: IOptions<S>) {
        super(options);
        InitStateByOptionsMixin.initMixin(this, options);
        ObservableMixin.initMixin(this, options);

        // Support of deprecated 'idProperty' option
        if (!this._$keyProperty && (options as any).idProperty) {
            this._$keyProperty = (options as any).idProperty;
        }

        if (!this.getSourceCollection()) {
            throw new Error(`${this._moduleName}: source collection is empty`);
        }
        if (this.getSourceCollection() instanceof Array) {
            this._$collection = create('Types/collection:List', {
                items: this.getSourceCollection(),
            });
        }
        if (!this.getSourceCollection()['[Types/_collection/IEnumerable]']) {
            throw new TypeError(
                `${this._moduleName}: source collection should implement Types/collection:IEnumerable`
            );
        }

        this._dataStrategy = this._createDataStrategy(options);
    }

    // region SourceCollection

    /**
     * Возвращает оригинальную коллекцию
     * @return {Types/_collection/RecordSet}
     * @see collection
     */
    getSourceCollection(): RecordSet {
        return this._$collection as unknown as RecordSet;
    }

    setCollection(newCollection: ISourceCollection<S>): void {
        if (this._$collection !== newCollection) {
            this._$collection = newCollection;
            this.getSourceDataStrategy().updateOptions({
                collection: newCollection,
            });
        }
    }

    // TODO удалить после использования getSourceCollection в канбане
    getCollection(): RecordSet {
        return this.getSourceCollection();
    }

    // endregion SourceCollection

    // region KeyProperty

    /**
     * Возвращает название свойства элемента коллекции, содержащего его уникальный идентификатор.
     * @return {String}
     */
    getKeyProperty(): string {
        return this._$keyProperty;
    }

    /**
     * Устанавливает название свойства элемента коллекции, содержащего его уникальный идентификатор.
     * @return {String}
     */
    setKeyProperty(keyProperty: string): void {
        if (keyProperty !== this.getKeyProperty()) {
            this._$keyProperty = keyProperty;
            this.getSourceDataStrategy().updateOptions({ keyProperty });
            this._nextVersion();
        }
    }

    // endregion KeyProperty

    // region DataStrategy

    getSourceDataStrategy(): IDataStrategy {
        return this._dataStrategy;
    }

    protected _createDataStrategy(options: IOptions<S>): IDataStrategy {
        return new FlatDataStrategy(options);
    }

    // endregion DataStrategy

    destroy(): void {
        this.getSourceDataStrategy().destroy();
        DestroyableMixin.prototype.destroy.call(this);
        ObservableMixin.prototype.destroy.call(this);
    }

    abstract createItem(options: { contents: S }): T;

    // region Statics

    /**
     * Возвращает проекцию по умолчанию
     * @param collection Объект, для которого требуется получить проекцию
     * @param [options] Опции конструктора проекции
     * @param [single=false] Возвращать singleton для каждой collection
     * @static
     */
    static getDefaultDisplay<S, T, U extends Abstract<S, T> = Abstract<S, T>>(
        collection: IEnumerable<S> | S[],
        options?: IOptions<S>,
        single?: boolean
    ): U {
        if (arguments.length === 2 && typeof options !== 'object') {
            single = options;
            options = {};
        }

        const index = single ? displaysToCollections.indexOf(collection) : -1;
        if (index === -1) {
            options = options || {};
            options.collection = collection;
            let instance;

            if (collection && collection['[Types/_collection/IEnumerable]']) {
                // Fix test ControlsUnit\SBIS3.CONTROLS\Selection\MassSelectionsController.test.js:62:20
                if (options && options.keyProperty === 'id' && Object.keys(options).length === 2) {
                    delete options.keyProperty;
                }
                instance = create('Controls/display:Collection', options);
            } else if (collection instanceof Array) {
                instance = create('Controls/display:Collection', options);
            } else {
                throw new TypeError(`Argument "collection" should implement Types/_collection/IEnumerable or be an ' +
                    'instance of Array, but "${collection}" given.`);
            }

            if (single) {
                displaysToCollections.push(collection);
                displaysToInstances.push(instance);
                displaysCounter.push(1);
            }

            return instance;
        } else {
            displaysCounter[index]++;
            return displaysToInstances[index] as any;
        }
    }

    /**
     * Освобождает проекцию, которую запрашивали через getDefaultDisplay как singleton
     * @param display Проекция, полученная через getDefaultDisplay с single=true
     * @return Ссылка на проекцию была освобождена
     * @static
     */
    static releaseDefaultDisplay<S, T>(display: Abstract<S, T>): boolean {
        const index = displaysToInstances.indexOf(display);
        if (index === -1) {
            return false;
        }

        displaysCounter[index]--;

        if (displaysCounter[index] === 0) {
            displaysToInstances[index].destroy();

            displaysCounter.splice(index, 1);
            displaysToInstances.splice(index, 1);
            displaysToCollections.splice(index, 1);
        }

        return true;
    }

    // endregion
}

Object.assign(Abstract.prototype, {
    '[Controls/_display/Abstract]': true,
    _moduleName: 'Controls/_display/Abstract',
    _$collection: null,
    _$keyProperty: '',
});
