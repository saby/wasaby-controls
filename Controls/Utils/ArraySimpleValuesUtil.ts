/**
 * Утилита для простых операция с массивом, таких как:
 * - Получение индекса элемента
 * - Получение индекса элемента с проверкой по типу (String/Integer)
 * - Проверка наличия элемента в массиве
 * @private
 */
interface IDifferenceArrays {
    added: any[];
    removed: any[];
}

const CONSTRUCTORS_FOR_TYPE_INVERTING = {
    string: Number,
    number: String,
};

function addSubArray(array: any[], items: any[]): any[] {
    items.forEach((item) => {
        if (!hasInArray(array, item)) {
            array.push(item);
        }
    });

    return array;
}

function removeSubArray(array: any[], items: any[]): any[] {
    let index: number;
    items.forEach((item) => {
        index = invertTypeIndexOf(array, item);
        if (index !== -1) {
            array.splice(index, 1);
        }
    });

    return array;
}

/**
 * Сравнивает два массива, возвращает разницу между ними
 * @param arrayOne
 * @param arrayTwo
 * @returns {{added: Array, removed: Array}}
 */
function getArrayDifference(
    arrayOne: any[],
    arrayTwo: any[]
): IDifferenceArrays {
    return {
        removed: arrayOne.filter((item) => {
            return !hasInArray(arrayTwo, item);
        }),
        added: arrayTwo.filter((item) => {
            return !hasInArray(arrayOne, item);
        }),
    };
}

function hasInArray(array: any[], elem: unknown): boolean {
    return invertTypeIndexOf(array, elem) !== -1;
}

function invertTypeIndexOf(array: any[], elem: unknown): number {
    let index: number = array.indexOf(elem);

    if (index === -1) {
        const elementType = typeof elem;

        // Данная утилита используется для операций с массивами,
        // в которых могут лежать любые типы данных.
        // Инвертировать тип необходимо только для строк и чисел.
        // Для остальных типов данных это не имеет смысла и только вызывает тормоза
        if (CONSTRUCTORS_FOR_TYPE_INVERTING[elementType]) {
            index = array.indexOf(
                CONSTRUCTORS_FOR_TYPE_INVERTING[elementType](elem)
            );
        }
    }

    return index;
}

function getIntersection(
    firstCollection: unknown[],
    secondCollection: unknown[]
): unknown[] {
    return firstCollection.filter((key) => {
        return secondCollection.includes(key);
    });
}

export = {
    addSubArray,
    removeSubArray,
    getArrayDifference,
    hasInArray,
    invertTypeIndexOf,
    getIntersection,
};
