import { IDataContextField, IDataField } from './interface';
import LocalAPI from './Local';
import ServiceAPI from './Service';

/**
 * API для работы с контекстом данных
 * @public
 * @see [Контекст данных](https://n.sbis.ru/article/08223bcf-5b6b-4573-9ff5-ae3a060cd6db)
 */
export default class DataContextAPI {
    private _localAPI: LocalAPI;
    private _serviceAPI: ServiceAPI;

    constructor(protected readonly _context: IDataContextField[] = []) {
        this._localAPI = new LocalAPI(this._context);
        this._serviceAPI = new ServiceAPI(this._context);
    }

    /**
     * Получить значение по точному пути.
     * Например, CurrentUser.ФИО
     * @see [Контекст данных](https://n.sbis.ru/article/08223bcf-5b6b-4573-9ff5-ae3a060cd6db)
     * @param path
     */
    getByPath(path: string = ''): unknown {
        return this._localAPI.getByPath(path);
    }

    /**
     * Получить значение по имени поля.
     * Например "ФИО"
     * Будет найдено значение в контексте по имени. Сначала ищем по имени поля в контексте.
     * Если по имени поля прямо не найдем, то поищем в полях, значение которых является объектом.
     * К примеру, если есть в контексте переменная типа Сотрудник, то ФИО будет найдено из него.
     * @see [Контекст данных](https://n.sbis.ru/article/08223bcf-5b6b-4573-9ff5-ae3a060cd6db)
     * @param name
     */
    getByName(name: string = ''): unknown {
        return this._localAPI.getByName(name);
    }

    /**
     * Получить значение поля по типу
     * Например, "Сотрудник".
     * Будет возвращено значение ближайшего поля типа Сотрудник.
     * @see [Контекст данных](https://n.sbis.ru/article/08223bcf-5b6b-4573-9ff5-ae3a060cd6db)
     * @param type
     */
    getByType(type: string = ''): unknown {
        return this._localAPI.getByType(type);
    }

    /**
     * @deprecated Использовать getByName
     * @param name
     */
    getValue(name: string): unknown {
        return this.getByName(name);
    }

    /**
     * @deprecated Использовать getByName или getByType
     * @param name
     */
    getObject(name: string): unknown {
        return this.getByName(name) || this.getByType(name) || null;
    }

    /**
     * Выполнить действие.
     * Например, "Удалить"
     * Поиск объекта для выполнения действия будет выполнен по алгоритму поиска поля по имени.
     * @see [Контекст данных](https://n.sbis.ru/article/08223bcf-5b6b-4573-9ff5-ae3a060cd6db)
     * @param method Название действия
     * @param methodArgs Аргументы действия
     */
    async execute(method: string, methodArgs: Record<string, unknown> = {}): Promise<unknown> {
        return this._serviceAPI.execute(method, methodArgs);
    }

    /**
     * Прочитать поля контекста данных.
     * Вернет контекст данных с заполненными значениями полей
     * @see [Контекст данных](https://n.sbis.ru/article/08223bcf-5b6b-4573-9ff5-ae3a060cd6db)
     * @param fields набор полей
     * @param context текущий контекст данных
     */
    async fillContextFields(
        fields: IDataField[],
        context: IDataContextField[]
    ): Promise<IDataContextField[]> {
        return this._serviceAPI.fillContextFields(fields, context);
    }
}
