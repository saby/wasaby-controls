/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
/**
 * @typedef {Object} ICssClassListChain
 * @property {Object} [classList]
 * @property {Function} [add] Adds class expression in class list.
 * @property {Function} [compile] Class list object in which key is a name of class and the value is a flag
 * indicates whether to add a class.
 */
interface ICssClassListChain {
    classList: IClassListObject;
    add(className: string, shouldAdd?: boolean): ICssClassListChain;
    compile(classListObject?: IClassListObject): string;
}

interface IClassListObject {
    [key: string]: boolean;
}

class StaticCssClassList {
    static add(
        className: string,
        shouldAdd: boolean = true
    ): ICssClassListChain {
        // @ts-ignore
        const classList: IClassListObject = this.classList || {};

        classList[className] = shouldAdd;

        return {
            classList,
            add: StaticCssClassList.add.bind({ classList }),
            compile: StaticCssClassList.compile.bind({ classList }),
        };
    }

    static compile(classList: IClassListObject = {}): string {
        let classListString = '';

        // @ts-ignore
        const classListObj: IClassListObject = this.classList || classList;

        for (const className in classListObj) {
            if (classListObj[className] !== false) {
                classListString += `${className} `;
            }
        }

        return classListString.trim();
    }
}

/**
 * A util helps to combine CSS classes.
 * It is non static variant of util, so it is possible to keep list of classes in instances' memory.
 * @example
 *
 * Combining any classes for some object to one class list and getting them as a string using static methods.
 * <pre>
 *     item.classList = CssClassList.add('my_item')
 *                                  .add('item_hovered', item.isHovered)
 *                                  .add('also_required_class', true)
 *                                  .add('item_large', item.size === 'lg')
 *                                  .compile();
 * </pre>
 * <br/>
 * Combining all classes for some difficult object to one class list and then getting them as a string
 * using CssClassList instance.
 * <pre>
 *
 *     let
 *         cell = { ... },
 *         cellClassList = new cellClassList({
 *              'item_cell': true,
 *              'item_cell_default': cell.style === 'default',
 *         });
 *
 *     cellClassList.add('item_cell_size_'+cell.size);
 *     ...
 *     cellClassList.add('never_added_class', false)
 *                 .add('item_cell_grouped', cell.parent.isGroup);
 *
 *     cell.classList = cellClassList.compile();
 *
 * </pre>
 *
 * @class CssClassList
 * @private
 */
class CssClassList {
    private _classList: IClassListObject;

    constructor(classList: IClassListObject = {}) {
        this._classList = { ...classList };
    }

    /**
     * Adds class expression in class list, can be chained.
     * @param {String} className Name of class
     * @param {Boolean} [shouldAdd=true] Should add a to class list
     * @return {CssClassList}
     * @public
     */
    add(className: string, shouldAdd: boolean = true): CssClassList {
        this._classList[className] = shouldAdd;
        return this;
    }

    /**
     * Returns class list.
     * Adds class only if the value of its key in class list object is true.
     * @remark Note, that method returns copy of instances' class list.
     * @return {Object}
     * @public
     */
    getClassList(): IClassListObject {
        return { ...this._classList };
    }

    /**
     * Clears class list, can be chained
     * @return {CssClassList}
     * @public
     */
    clear(): CssClassList {
        this._classList = {};
        return this;
    }

    /**
     * Compiles class list object to string, can be only last in chain.
     * Adds class only if the value of its key in class list object is true.
     * @return {string}
     * @public
     */
    compile(): string {
        return StaticCssClassList.compile(this._classList);
    }

    /**
     * Adds class expression in class list given by chain.
     * @param {String} className Name of class
     * @param {Boolean} [shouldAdd=true] Should add a to class list
     * @return {ICssClassListChain}
     * @static
     * @public
     */
    static add(
        className: string,
        shouldAdd: boolean = true
    ): ICssClassListChain {
        return StaticCssClassList.add(className, shouldAdd);
    }

    /**
     * Compiles class list object to string, can be only last in chain.
     * Static variant of function.
     * Class list may be given by chaining or as an argument.
     * Adds class only if the the keys' value in class list object is true.
     * @param {Object} [classList={}] Class list
     * @return {string}
     * @static
     * @public
     */
    static compile(classList: IClassListObject): string {
        return StaticCssClassList.compile(classList);
    }
}

function getAll(classListCollection: Record<string, string>): string {
    let classes = '';
    for (const classListName in classListCollection) {
        if (classListName !== 'getAll') {
            const value = classListCollection[classListName];
            if (typeof value === 'string') {
                classes += `${classListCollection[classListName].trim()} `;
            } else if (typeof value === 'object' && !!value.getAll) {
                classes += `${value.getAll()} `;
            }
        }
    }
    return classes.trim();
}

function createClassListCollection(...classListNames: string[]) {
    const classListCollection = { getAll: null };
    classListNames.forEach((classListName) => {
        classListCollection[classListName] = '';
    });
    classListCollection.getAll = getAll.bind(null, classListCollection);
    return classListCollection;
}

export { CssClassList, createClassListCollection };
