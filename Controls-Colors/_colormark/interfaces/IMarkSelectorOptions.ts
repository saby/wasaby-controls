import { IColorMarkElement } from './IColorMarkElement';
import { ICustomMarkElement } from './ICustomMarkElement';
import { IPaletteElement } from './IPaletteElement';
import { Model } from 'Types/entity';
import { ReactElement } from 'react';
import { TKey } from 'Controls/interface';
import { IChangeTypeButtonVisibility } from './IChangeTypeButtonVisibility';

export type TMarkElement = IColorMarkElement | ICustomMarkElement;

/**
 * Интерфейс для компонента 'Пометки цветом'.
 * @public
 */
export interface IMarkSelectorOptions extends IChangeTypeButtonVisibility {
    /**
     * @name Controls-Colors/_colormark/interfaces/IMarkSelectorOptions#items
     * @cfg {Array<Controls-Colors/colormark:IColorMarkElement|Controls-Colors/colormark:ICustomMarkElement>} Набор пометок.
     * @demo Controls-Colors-demo/Panel/Items/Index
     * @example
     * Создадим набор с кастомными пометками в виде иконок.
     * <pre>
     *    const itemsWithCustom: ICustomMarkElement[] = [
     *      {
     *         id: '4',
     *         icon: 'Flag',
     *         iconStyle: 'primary',
     *         iconSize: 'm',
     *         caption: 'Важный'
     *      },
     *      {
     *         id: '5',
     *         icon: 'Add',
     *         iconStyle: 'primary',
     *         iconSize: 'm',
     *         caption: 'Плюс'
     *      }
     *      ...
     *    ]
     * </pre>
     */
    items: TMarkElement[];
    /**
     * @name Controls-Colors/_colormark/interfaces/IMarkSelectorOptions#selectedKeys
     * @cfg {Array<Number|String>} Массив ключей выбранных элементов.
     */
    selectedKeys: TKey[];
    /**
     * @name Controls-Colors/_colormark/interfaces/IMarkSelectorOptions#excludedKeys
     * @cfg {Array<Number|String>} Набор ключей исключенных элементов.
     */
    excludedKeys?: TKey[];
    /**
     * @name Controls-Colors/_colormark/interfaces/IMarkSelectorOptions#palette
     * @cfg {Array<Controls-Colors/colormark:IPaletteElement>} Набор доступных цветов пометок.
     * @example
     * Создадим набор пометок на основе имен переменных.
     * <pre>
     *    const palette = [
     *      {
     *          color: '--secondary_color'
     *      },
     *      {
     *          color: '--primary_color'
     *      },
     *      {
     *         color: '--danger_color'
     *      }
     *      ...
     *    ]
     * </pre>
     * <pre>
     *     <Panel palette={palette}
     *            ...
     *     />
     * </pre>
     * @demo Controls-Colors-demo/Panel/Index
     */
    palette: IPaletteElement[];
    /**
     * @name Controls-Colors/_colormark/interfaces/IMarkSelectorOptions#className
     * @cfg {String} Класс, который будет применен к корневой ноде панели.
     */
    className?: string;
    /**
     * Cобытие возникающее при клике на пометки или чекбоксы. Аргументом приходит массив текущих
     * выбранных ключей, необходимо вернуть новый набор ключей.
     */
    onBeforeSelectionChanged?: (keys: string[]) => string[];
    /**
     * Событие возникающее при редактировании конкретной пометки - можно запретить или вызвать свой
     * метод как для редактирования, так и для добавления. Аргументом приходит объект с полем item.
     */
    onBeforeEdit?: (params?: { item: Model }) => boolean;
    /**
     * Событие возникающее перед завершением редактирования конкретной пометки. Подробнее {@link Controls/list:IEditableList тут}
     */
    onBeforeEndEdit?: (
        item: Model,
        commit: boolean,
        isAdd: boolean
    ) => Promise<TMarkElement> | TMarkElement | string;
    /**
     * Событие возникающее при удалении конкретной пометки - можно запретить или вызвать свой
     * метод. Аргументом приходит объект с полем item.
     */
    onBeforeDelete?: (params: { item: Model }) => boolean;
    /**
     * Происходит при изменении выбранных элементов. Аргументом приходит массив текущих
     * выбранных ключей.
     */
    onSelectedKeysChanged: (keys: string[], isItemClick?: boolean) => void;
    /**
     * @name Controls-Colors/_colormark/interfaces/IMarkSelectorOptions#emptyTemplate
     * @cfg {ReactElement} Пользовательский шаблон отображения компонента без пометок.
     */
    emptyTemplate?: ReactElement;

    multiSelect?: boolean;
    onAfterEndEdit?: () => void;
    onBeforeBeginEdit?: () => void;
    isAdaptive: boolean;
}
