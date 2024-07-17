import { Slice } from 'Controls-DataEnv/slice';

interface IDataFactoryArguments {
    data: string[];
}

function loadData(args: IDataFactoryArguments) {
    return Promise.resolve(args.data);
}

/*
 * Демо-фабрика, которая возвращает данные из аргумента
 */
export const factory = {
    loadData,
};

/*
 * Конфиг загрузки данных редактора
 */
export function EditorDataConfigGetter(
    _props: unknown,
    _filter: unknown,
    _router: unknown,
    dataContext: Record<string, Slice<unknown>>
): object {
    const externalContextData = dataContext?.MySlice?.state || 'Нет внешнего контекста';
    return {
        hobby: {
            dataFactoryName:
                'Controls-editors-demo/PropertyGrid/EditorDataLoader/DataFactory:factory',
            dataFactoryArguments: {
                data: ['Собственные данные', externalContextData],
            },
        },
    };
}

export const demoFactory = {
    slice: Slice,
    loadData,
};
