import { Model, Record } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { Collection, CollectionItem, ISwipeConfig } from 'Controls/display';
import { IOptions as ICollectionOptions } from 'Controls/_display/Collection';
import { Logger } from 'UI/Utils';

import {
    Controller as ItemActionsController,
    IControllerOptions,
} from 'Controls/_itemActions/Controller';
import { IItemAction, TActionDisplayMode, TItemActionShowType } from 'Controls/interface';
import { IItemActionsItem } from 'Controls/_itemActions/interface/IItemActionsItem';
import { IItemActionsCollection } from 'Controls/_itemActions/interface/IItemActionsCollection';
import { DOMUtil } from 'Controls/sizeUtils';

// 3 опции будут показаны в тулбаре, 6 в контекстном меню
const itemActions: IItemAction[] = [
    {
        id: 'phone',
        icon: 'icon-PhoneNull',
        title: 'phone',
        showType: TItemActionShowType.MENU,
    },
    {
        id: 'message',
        icon: 'icon-EmptyMessage',
        title: 'message',
        showType: TItemActionShowType.MENU_TOOLBAR,
    },
    {
        id: 'profile',
        icon: 'icon-Profile',
        title: 'Profile',
        tooltip: "This is awesome Profile you've never seen",
        showType: TItemActionShowType.TOOLBAR,
    },
    {
        id: 'timeManagement',
        icon: 'icon-Time',
        title: 'Time management',
        showType: TItemActionShowType.FIXED,
        'parent@': true,
    },
    {
        id: 'documentation',
        title: 'Documentation',
        showType: TItemActionShowType.TOOLBAR,
        parent: 'timeManagement',
    },
    {
        id: 'development',
        title: 'Development',
        showType: TItemActionShowType.MENU_TOOLBAR,
        parent: 'timeManagement',
    },
    {
        id: 'exploitation',
        title: 'Exploitation',
        showType: TItemActionShowType.MENU,
        parent: 'timeManagement',
        'parent@': true,
    },
    {
        id: 'approval',
        title: 'Approval',
        showType: TItemActionShowType.MENU,
        parent: 'exploitation',
        'parent@': true,
    },
];

// Только одна опция в тулбаре, одна - в контекстном меню
const horizontalOnlyItemActions: IItemAction[] = [
    {
        id: 'phone',
        icon: 'icon-PhoneNull',
        title: 'phone',
        showType: TItemActionShowType.TOOLBAR,
    },
    {
        id: 'message',
        icon: 'icon-EmptyMessage',
        title: 'message',
        showType: TItemActionShowType.MENU,
    },
];

// Варианты отображением иконки и текста
const displayModeItemActions: IItemAction[] = [
    {
        id: 'phone',
        icon: 'icon-PhoneNull',
        title: 'phone',
        showType: TItemActionShowType.TOOLBAR,
        displayMode: TActionDisplayMode.ICON,
    },
    {
        id: 'message',
        icon: 'icon-EmptyMessage',
        title: 'message',
        showType: TItemActionShowType.TOOLBAR,
        displayMode: TActionDisplayMode.TITLE,
    },
    {
        id: 'profile',
        icon: 'icon-Profile',
        title: 'Profile',
        showType: TItemActionShowType.TOOLBAR,
        displayMode: TActionDisplayMode.BOTH,
    },
    {
        id: 'timeManagement',
        icon: 'icon-Time',
        title: 'Time management',
        showType: TItemActionShowType.TOOLBAR,
        displayMode: TActionDisplayMode.AUTO,
    },
];

const data = [
    { id: 1, name: 'Philip J. Fry', gender: 'M', itemActions: [] },
    {
        id: 2,
        name: 'Turanga Leela',
        gender: 'F',
        itemActions: [
            {
                id: 1,
                icon: 'icon-Link',
                title: 'valar morghulis',
                showType: TItemActionShowType.TOOLBAR,
            },
            {
                id: 2,
                icon: 'icon-Print',
                title: 'print',
                showType: TItemActionShowType.MENU,
            },
        ],
    },
    { id: 3, name: 'Professor Farnsworth', gender: 'M', itemActions: [] },
    { id: 4, name: 'Amy Wong', gender: 'F', itemActions: [] },
    { id: 5, name: 'Bender Bending Rodriguez', gender: 'R', itemActions: [] },
];

describe('Controls/_itemActions/Controller', () => {
    let itemActionsController: ItemActionsController;
    let collection: IItemActionsCollection;
    let initialVersion: number;

    function makeCollection(
        rawData: {
            id: number;
            name: string;
            gender: string;
            itemActions: IItemAction[];
        }[]
    ): IItemActionsCollection {
        const list = new RecordSet({
            keyProperty: 'id',
            rawData,
        });
        const collectionConfig: ICollectionOptions<Record, IItemActionsItem> = {
            collection: list,
            keyProperty: 'id',
            leftSpacing: null,
            rightSpacing: null,
            rowSpacing: null,
            searchValue: null,
            editingConfig: null,
        };
        // @ts-ignore
        return new Collection<Record>(collectionConfig);
    }

    function initializeControllerOptions(options?: IControllerOptions): IControllerOptions {
        return {
            collection: options ? options.collection : null,
            itemActions: options ? options.itemActions : null,
            itemActionsProperty: options ? options.itemActionsProperty : null,
            visibilityCallback: options ? options.visibilityCallback : null,
            itemActionsPosition: options ? options.itemActionsPosition : null,
            style: options ? options.style : null,
            theme: options ? options.theme : 'default',
            actionAlignment: options ? options.actionAlignment : null,
            actionCaptionPosition: options ? options.actionCaptionPosition : null,
            editingToolbarVisible: options ? options.editingToolbarVisible : false,
            editArrowAction: options ? options.editArrowAction : null,
            editArrowVisibilityCallback: options ? options.editArrowVisibilityCallback : null,
            contextMenuConfig: options ? options.contextMenuConfig : null,
            iconSize: options ? options.iconSize : 'm',
            editingItem: options ? options.editingItem : null,
            itemActionsVisibility: options ? options.itemActionsVisibility : 'onhover',
            actionMode: 'strict',
        };
    }

    beforeEach(() => {
        collection = makeCollection(data);
        // @ts-ignore
        initialVersion = collection.getVersion();
        itemActionsController = new ItemActionsController();
        // @ts-ignore
        itemActionsController.update(
            initializeControllerOptions({
                collection,
                itemActions,
                theme: 'default',
            })
        );
    });

    describe('Controller initialization is correct', () => {
        // T1.1.  Для каждого элемента коллекции задаётся набор операций.
        it('should assign item actions for every item', () => {
            const actionsOf1 = collection.getItemBySourceKey(1).getActions();
            const actionsOf5 = collection.getItemBySourceKey(5).getActions();
            expect(actionsOf1).not.toBeNull();
            expect(actionsOf5).not.toBeNull();
            expect(actionsOf1.showed[0].id).toEqual('message');
            expect(actionsOf5.showed[0].id).toEqual('message');
        });

        // T1.1.1.  Ннабор операций задаётся, в том числе для активного Item.
        // то, что активный элемент был добавлен в исключения - по -видимому, рудимент,
        // Возможно, предполагалось, что активному item опции задаются отдельно, поэтому если в рамках
        // https://online.sbis.ru/opendoc.html?guid=716cc8d4-cea2-4335-b9b1-a8674bdaf5f9 будет реализована какая-то
        // такая логика,
        // возможно, следует вернуть проверку на active
        it('should assign item actions for every item', () => {
            collection.getItemBySourceKey(1).setActive(true);
            const actionsOf1 = collection.getItemBySourceKey(1).getActions();
            expect(actionsOf1).not.toBeNull();
            expect(actionsOf1.showed[0].id).toEqual('message');
        });

        // T1.2.  В коллекции происходит набор конфигурации для шаблона ItemActions.
        it('should build a config for item action template', () => {
            const config = collection.getActionsTemplateConfig();
            expect(config).not.toBeNull();
        });

        // T1.4. При установке набора операций учитывается itemActionsProperty
        it('should consider itemActionsProperty', () => {
            // @ts-ignore
            itemActionsController.update(
                initializeControllerOptions({
                    collection,
                    itemActions,
                    theme: 'default',
                    itemActionsProperty: 'itemActions',
                })
            );
            const actionsOf1 = collection.getItemBySourceKey(1).getActions();
            const actionsOf2 = collection.getItemBySourceKey(2).getActions();
            expect(actionsOf1).not.toBeNull();
            expect(actionsOf2).not.toBeNull();
            expect(Object.keys(actionsOf1.showed)).toHaveLength(0);
            expect(actionsOf2.showed[0].id).toEqual(1);
        });

        // Случай, когда указан itemActionsProperty, но Record.get(itemActionsProperty) === undefined
        it('should return empty itemActions when Record.get(itemActionsProperty) === undefined', () => {
            const newData = [
                {
                    id: 1,
                    name: 'Doctor John Zoidberg',
                    gender: 'M',
                    itemActions: undefined,
                },
                {
                    id: 2,
                    name: 'Zapp Brannigan',
                    gender: 'M',
                    itemActions: undefined,
                },
            ];
            const loggerErrorStub = jest.spyOn(Logger, 'error').mockClear().mockImplementation();
            collection = makeCollection(newData);
            // @ts-ignore
            itemActionsController.update(
                initializeControllerOptions({
                    collection,
                    itemActions,
                    theme: 'default',
                    itemActionsProperty: 'itemActions',
                })
            );
            const actionsOf2 = collection.getItemBySourceKey(2).getActions();

            expect(Object.keys(actionsOf2.showed)).toHaveLength(0);
            expect(loggerErrorStub).toHaveBeenCalledTimes(2);
        });

        // T1.6. После установки набора операций у коллекции устанавливается параметр actionsAssigned
        it('should set actionsAssigned value as true', () => {
            expect(itemActionsController.isActionsAssigned()).toBe(true);
        });

        // T1.8. В список showed операций изначально попадают операции, у которых нет родителя
        // с showType TOOLBAR, MENU_TOOLBAR и FIXED
        it('"showed" contains actions.showType===TOOLBAR|MENU_TOOLBAR|FIXED, w/o parent', () => {
            const actionsOf4 = collection.getItemBySourceKey(4).getActions();
            expect(actionsOf4).not.toBeNull();
            expect(actionsOf4.showed[0].title).not.toEqual('phone');
            expect(actionsOf4.showed[3].title).not.toEqual('Time management');
        });

        // T1.11. Если в ItemActions всё пусто, не должно происходить инициализации
        it('should not initialize item actions when itemActions and itemActionsProperty are not set', () => {
            collection = makeCollection(data);
            // @ts-ignore
            itemActionsController.update(
                initializeControllerOptions({
                    collection,
                    itemActions: null,
                    theme: 'default',
                })
            );
            const actionsOf3 = collection.getItemBySourceKey(3).getActions();
            expect(actionsOf3).toBeNull();
        });

        // T1.12. При смене модели нужно менять модель также и в контроллере
        it('should change model inside controller when model is not the same', () => {
            const newData = [
                {
                    id: 6,
                    name: 'Doctor John Zoidberg',
                    gender: 'M',
                    itemActions: [],
                },
                { id: 7, name: 'Zapp Brannigan', gender: 'M', itemActions: [] },
            ];
            const newCollection = makeCollection(newData);
            // @ts-ignore
            itemActionsController.update(
                initializeControllerOptions({
                    collection: newCollection,
                    itemActions,
                    theme: 'default',
                })
            );
            expect(newCollection.getItemBySourceKey(6).getActions()).toBeDefined();
        });

        // T1.14 Необходимо корректно расчитывать showTitle, showIcon на основе displayMode
        describe('displayMode calculations', () => {
            beforeEach(() => {
                // @ts-ignore
                itemActionsController.update(
                    initializeControllerOptions({
                        collection,
                        itemActions: displayModeItemActions,
                        theme: 'default',
                    })
                );
            });
            // T1.14.1. Должны учитываться расчёты отображения icon при displayMode=icon
            it('should consider showIcon calculations when displayMode=icon', () => {
                const actionsOf1 = collection.getItemBySourceKey(1).getActions();
                expect(actionsOf1.showed[0].hasIcon).toBe(true);
                expect(actionsOf1.showed[0].caption).toBeNull();
            });

            // T1.14.2. Должны учитываться расчёты отображения title при displayMode=title
            it('should consider showTitle calculations when displayMode=title', () => {
                const actionsOf1 = collection.getItemBySourceKey(1).getActions();
                expect(actionsOf1.showed[1].caption).not.toBeNull();
                expect(actionsOf1.showed[1].hasIcon).not.toBe(true);
            });

            // T1.14.3. Должны учитываться расчёты отображения title и icon при displayMode=both
            it('should consider showTitle calculations when displayMode=both', () => {
                const actionsOf1 = collection.getItemBySourceKey(1).getActions();
                expect(actionsOf1.showed[2].caption).not.toBeNull();
                expect(actionsOf1.showed[2].hasIcon).toBe(true);
            });

            // T1.14.4. Должны учитываться расчёты отображения title и icon при displayMode=auto
            it('should consider showTitle calculations when displayMode=auto', () => {
                const actionsOf1 = collection.getItemBySourceKey(1).getActions();
                expect(actionsOf1.showed[3].caption).toBeNull();
                expect(actionsOf1.showed[3].hasIcon).toBe(true);
            });
        });

        // T1.15. Если не указано свойство опции tooltip, надо подставлять title
        it('should change tooltip to title when no tooltip is set', () => {
            const actionsOf1 = collection.getItemBySourceKey(1).getActions();
            expect(actionsOf1.showed[0].tooltip).toEqual('message');
            expect(actionsOf1.showed[1].tooltip).toEqual(
                "This is awesome Profile you've never seen"
            );
        });

        // T1.17 Если редактируемой(добавляемой) записи нет в рекордсете операции над записью инициализируются для нее
        it('should assign itemActions for editig item that is not in collection', () => {
            const list = new RecordSet({
                keyProperty: 'id',
                rawData: [
                    {
                        id: 100,
                        name: 'Philip J. Fry',
                        gender: 'M',
                        itemActions: [],
                    },
                ],
            });
            const editingItem = new CollectionItem<Record>({
                contents: list.at(0),
            });
            editingItem.setEditing(true, editingItem.getContents());
            // @ts-ignore
            collection.setEditing(true);
            const spySetActionsArray = collection
                .getItems()
                .filter((it) => {
                    return it !== editingItem;
                })
                .map((it) => {
                    return jest.spyOn(it, 'setActions').mockClear();
                });
            itemActionsController.update(
                initializeControllerOptions({
                    // @ts-ignore
                    editingItem,
                    collection,
                    itemActions,
                    theme: 'default',
                })
            );
            expect(editingItem.getActions().showed.length).toEqual(4);
            // При наличии редактируемой записи должны обновить itemActions только на ней
            spySetActionsArray.forEach((spySetActions) => {
                expect(spySetActions).not.toHaveBeenCalled();
                spySetActions.mockRestore();
            });
        });

        // T1.17. Должны адекватно набираться ItemActions для breadcrumbs (когда getContents() возвращает массив
        // записей)
        // TODO возможно, это уйдёт из контроллера, т.к. по идее уровень абстракции в контроллере ниже и он не должен
        //  знать о breadcrumbs
        //  надо разобраться как в коллекцию добавить breadcrumbs
        // it('should set item actions when some items are breadcrumbs', () => {});

        // T1.18. Должны адекватно набираться ItemActions если в списке элементов коллекции присутствуют группы
        // TODO возможно, это уйдёт из контроллера, т.к. по идее уровень абстракции в контроллере ниже и он не должен
        //  знать о группах
        //  надо разобраться как в коллекцию добавить group
        // it('should set item actions when some items are groups', () => {});

        it("should call collection.setActions() when itemAction's showType has changed", () => {
            const newItemActions = itemActions.map((itemAction: IItemAction) => {
                const itemActionClone: IItemAction = { ...itemAction };
                if (itemActionClone.showType === TItemActionShowType.TOOLBAR) {
                    itemActionClone.showType = TItemActionShowType.MENU_TOOLBAR;
                }
                return itemActionClone;
            });
            const item3 = collection.getItemBySourceKey(3);
            const spySetActions = jest.spyOn(item3, 'setActions').mockClear();
            // @ts-ignore
            itemActionsController.update(
                initializeControllerOptions({
                    collection,
                    itemActions: newItemActions,
                    theme: 'default',
                })
            );
            expect(spySetActions).toHaveBeenCalled();
        });
    });

    // T2. Активация и деактивация Swipe происходит корректно
    describe('activateSwipe(), deactivateSwipe() and getSwipeItem() ', () => {
        beforeEach(() => {
            jest.spyOn(DOMUtil, 'getElementsWidth')
                .mockClear()
                .mockImplementation(
                    (itemsHtml: string[], itemClass: string, considerMargins?: boolean) => {
                        return itemsHtml.map((item) => {
                            return 25;
                        });
                    }
                );
            jest.spyOn(DOMUtil, 'getWidthForCssClass').mockClear().mockReturnValue(0);
        });

        // T2.1. В коллекции происходит набор конфигурации для Swipe, если позиция itemActions не outside.
        // itemActions сортируются по showType.
        it('should collect swiped item actions sorted by showType when position !== "outside"', () => {
            // @ts-ignore
            itemActionsController.update(
                initializeControllerOptions({
                    collection,
                    itemActions,
                    theme: 'default',
                    itemActionsPosition: 'inside',
                })
            );
            itemActionsController.activateSwipe(3, 100, 50);
            const config = collection.getSwipeConfig();
            expect(config).toBeDefined();
            expect(config.itemActions.showed[0].id).toEqual('profile');
        });

        // T2.2. itemActions outside не влияет на набор конфигурации для Swipe
        it('should collect swipe config when position === "outside"', () => {
            // @ts-ignore
            itemActionsController.update(
                initializeControllerOptions({
                    collection,
                    itemActions,
                    theme: 'default',
                    itemActionsPosition: 'outside',
                })
            );
            itemActionsController.activateSwipe(3, 100, 50);
            const config = collection.getSwipeConfig();
            expect(config).not.toBeNull();
        });

        // T2.3. В зависимости от actionAlignment, для получения конфигурации используется правильный measurer
        it("should use horizontal measurer when actionAlignment='horizontal'", () => {
            // @ts-ignore
            itemActionsController.update(
                initializeControllerOptions({
                    collection,
                    itemActions,
                    theme: 'default',
                    actionAlignment: 'horizontal',
                })
            );
            itemActionsController.activateSwipe(3, 100, 50);
            const config = collection.getSwipeConfig();
            expect(config.twoColumns).not.toBeDefined();
        });

        // T2.3. В зависимости от actionAlignment, для получения конфигурации используется правильный measurer
        // T2.5. Конфигурация для Swipe происходит с установкой twoColumnsActions,
        // если measurer вернул в конфиг twoColumns
        it("should use vertical measurer when actionAlignment='vertical'", () => {
            // @ts-ignore
            itemActionsController.update(
                initializeControllerOptions({
                    collection,
                    itemActions,
                    theme: 'default',
                    actionAlignment: 'vertical',
                })
            );
            itemActionsController.activateSwipe(3, 100, 65);
            const config = collection.getSwipeConfig();
            expect(typeof config.twoColumns).toBe('boolean');
            expect(config.twoColumnsActions).toBeDefined();
        });

        // T2.4. Конфигурация для Swipe происходит с actionAlignment=’horizontal’, если только одна опция
        // доступна в тулбаре
        it('should collect swipe configuration with actionAlignment="horizontal" when only one option should be showed in toolbar', () => {
            // @ts-ignore
            itemActionsController.update(
                initializeControllerOptions({
                    collection,
                    itemActions: horizontalOnlyItemActions,
                    theme: 'default',
                    actionAlignment: 'vertical',
                })
            );
            itemActionsController.activateSwipe(3, 100, 50);
            const config = collection.getSwipeConfig();
            expect(config.twoColumns).not.toBeDefined();
        });

        // T2.4.1 Необходимо обновлять конфиг ItemActions после расчёта конфигурации swipe
        it('should Update actionsTemplateConfig after calculating itemSwipe configuration', () => {
            // @ts-ignore
            itemActionsController.update(
                initializeControllerOptions({
                    collection,
                    itemActions: horizontalOnlyItemActions,
                    theme: 'default',
                    actionAlignment: 'vertical',
                })
            );
            itemActionsController.activateSwipe(3, 100, 50);
            const config = collection.getActionsTemplateConfig();
            expect(config.actionAlignment).toEqual('horizontal');
        });

        // T2.4.2 Если свайпнули элемент, то при обновлении контроллера надо в шаблон прокидывать правильно
        // рассчитанный actionsTemplateConfig.
        // Такой кейс возникает, например, нажали на какую-либо опцию в свайпе. Например, "Показать/скрыть".
        // При этом фокус не потерялся, ItemActions не изменились - свайп не закрылся, но его надо перерисовать,
        // т.к. поменялось значение, которое возвращает visibilityCallback() для actions.
        it('should update actionsTemplateConfig with correct options when item is swiped', () => {
            const updateWithSameParams = () => {
                // @ts-ignore
                itemActionsController.update(
                    initializeControllerOptions({
                        collection,
                        itemActions: horizontalOnlyItemActions,
                        theme: 'default',
                        actionAlignment: 'vertical',
                    })
                );
            };
            updateWithSameParams();
            itemActionsController.activateSwipe(3, 100, 50);
            const config = collection.getActionsTemplateConfig();
            expect(config.actionAlignment).toEqual('horizontal');
            // Не деактивировали свайп и вызвали обновление ItemActions
            updateWithSameParams();
            expect(config.actionAlignment).toEqual('horizontal');
        });

        // T2.4.3 Если свайпнули другой элемент, то при обновлении контроллера надо в шаблон прокидывать
        // правильно рассчитанный конфиг
        it('should update actionsTemplateConfig with correct options when another item is swiped', () => {
            const updateWithSameParams = () => {
                // @ts-ignore
                itemActionsController.update(
                    initializeControllerOptions({
                        collection,
                        itemActions: horizontalOnlyItemActions,
                        theme: 'default',
                        actionAlignment: 'vertical',
                    })
                );
            };
            updateWithSameParams();
            itemActionsController.activateSwipe(3, 100, 50);
            let config = collection.getActionsTemplateConfig();
            expect(config.actionAlignment).toEqual('horizontal');
            // Активировали новый свайп и обновили конфиг
            itemActionsController.activateSwipe(2, 100, 100);
            updateWithSameParams();
            config = collection.getActionsTemplateConfig();
            expect(config.actionAlignment).toEqual('vertical');
        });

        // T2.6. Устанавливается swiped элемент коллекции
        // T2.7. Устанавливается активный элемент коллекции
        // T2.8. Метод getSwipedItem возвращает корректный swiped элемент
        it('should set swiped and active collection item', () => {
            itemActionsController.activateSwipe(2, 100, 50);
            const activeItem = collection.getActiveItem();
            // @ts-ignore
            const swipedItem: CollectionItem<Record> =
                itemActionsController.getSwipeItem() as CollectionItem<Record>;
            expect(activeItem).toBeDefined();
            expect(swipedItem).toBeDefined();
            // @ts-ignore
            expect(activeItem).toEqual(swipedItem);
        });

        // T2.9. Происходит сброс swiped элемента, активного элемента, конфигурации для Swipe при деактивации свайпа
        it('should reset swiped item, active item and swipe configuration when deactivating swipe', () => {
            itemActionsController.activateSwipe(1, 100, 50);
            itemActionsController.deactivateSwipe();
            const activeItem = collection.getActiveItem();
            // @ts-ignore
            const swipedItem: CollectionItem<Record> =
                itemActionsController.getSwipeItem() as CollectionItem<Record>;
            const config = collection.getSwipeConfig();
            expect(activeItem).toBeNull();
            expect(swipedItem).toBeNull();
            expect(config).toBeNull();
        });

        // T2.10. При свайпе добавляется editArrow в набор операций, вызывается editArrowVisibilityCallback.
        it('should add editArrow for every item action when necessary', () => {
            const editArrowAction: IItemAction = {
                id: 'view',
                icon: '',
                showType: TItemActionShowType.TOOLBAR,
            };
            let recordWithCorrectType = false;
            const editArrowVisibilityCallback = (record: Model) => {
                // Тут не должна попасть проекция
                recordWithCorrectType = !!record.get && !record.getContents;
                return true;
            };
            // @ts-ignore
            itemActionsController.update(
                initializeControllerOptions({
                    collection,
                    itemActions,
                    theme: 'default',
                    editArrowAction,
                    editArrowVisibilityCallback,
                })
            );

            itemActionsController.activateSwipe(1, 100, 50);
            const config = collection.getSwipeConfig();
            expect(config).toBeDefined();
            expect(recordWithCorrectType).toBe(true);
            expect(config.itemActions.showed[0].id).toEqual('view');
        });

        // T2.10.1 При свайпе editArrow добавляется в набор операций также и при itemActionsPosition: 'outside'
        it("should add editArrow when itemActionsPosition: 'outside'", () => {
            const editArrowAction: IItemAction = {
                id: 'view',
                icon: '',
                showType: TItemActionShowType.TOOLBAR,
            };
            const editArrowVisibilityCallback = () => {
                return true;
            };
            itemActionsController.update(
                initializeControllerOptions({
                    collection,
                    itemActions,
                    theme: 'default',
                    editArrowAction,
                    itemActionsPosition: 'outside',
                    editArrowVisibilityCallback,
                })
            );
            itemActionsController.activateSwipe(1, 50);
            const item = itemActionsController.getSwipeItem();
            expect(item).toBeDefined();
            expect(item.getActions().showed[0].id).toEqual('view');
        });

        // T2.12 При вызове getSwipeItem() контроллер должен возвращать true
        // вне зависимости оттипа анимации и направления свайпа.
        it('method getSwipeItem() should return swoped item despite of current animation type and direction', () => {
            // @ts-ignore
            const item: CollectionItem<Record> = collection.getItemBySourceKey(1);
            let swipedItem: CollectionItem<Record>;

            itemActionsController.activateSwipe(1, 100, 50);
            // @ts-ignore
            swipedItem = itemActionsController.getSwipeItem() as CollectionItem<Record>;
            expect(swipedItem).toEqual(item);
            itemActionsController.deactivateSwipe();

            // @ts-ignore
            swipedItem = itemActionsController.getSwipeItem() as CollectionItem<Record>;
            expect(swipedItem).toEqual(null);

            const collectionVersion = collection.getVersion();
            itemActionsController.deactivateSwipe();
            // @ts-ignore
            swipedItem = itemActionsController.getSwipeItem() as CollectionItem<Record>;
            expect(swipedItem).toEqual(null);
            expect(collection.getVersion()).toEqual(collectionVersion);
        });

        // T2.13 При обновлении опций записи надо также обновлять конфиг свайпа
        it('should update swipe config on item actions update', () => {
            const itemActionsClone = [...itemActions];
            let visibilityCallbackResult = false;
            let config: ISwipeConfig;
            const controllerConfig = {
                collection,
                itemActions: itemActionsClone,
                theme: 'default',
                visibilityCallback: (action: IItemAction, item: Record) => {
                    if (action.id === 9) {
                        return visibilityCallbackResult;
                    }
                    return true;
                },
            };
            itemActionsClone.splice(3, 0, {
                id: 9,
                icon: 'icon-SuperIcon',
                title: 'Super puper',
                showType: TItemActionShowType.TOOLBAR,
            });
            // @ts-ignore
            itemActionsController.update(initializeControllerOptions(controllerConfig));
            itemActionsController.activateSwipe(1, 100, 50);
            config = collection.getSwipeConfig();
            expect(config).toBeDefined();
            expect(config.itemActions.showed[1].title).toEqual('message');

            visibilityCallbackResult = true;
            // @ts-ignore
            itemActionsController.update(initializeControllerOptions(controllerConfig));
            config = collection.getSwipeConfig();
            expect(config.itemActions.showed[1].title).toEqual('Super puper');
        });

        // Необходимо запоминать предыдущие itemActions, если режим отображения itemActionsVisibility='visible'
        it("should remember itemActions before swipe when itemActionsVisibility='visible'", () => {
            // @ts-ignore
            itemActionsController.update(
                initializeControllerOptions({
                    collection,
                    itemActions,
                    theme: 'default',
                    itemActionsVisibility: 'visible',
                })
            );
            const savedItemActions = collection.at(0).getActions();

            // при активации сохраняется предыдущее состояние
            itemActionsController.activateSwipe(1, 75, 50);
            expect(collection.at(0).getActions().showed.length).not.toEqual(
                savedItemActions.showed.length
            );

            // при деактивации всё возвращается обратно
            itemActionsController.deactivateSwipe();
            expect(collection.at(0).getActions().showed.length).toEqual(
                savedItemActions.showed.length
            );
        });
    });

    describe('setActiveItem(), getActiveItem()', () => {
        it('deactivates old active item', () => {
            const testingItem = collection.getItemBySourceKey(1);
            itemActionsController.setActiveItem(collection.getItemBySourceKey(1));
            itemActionsController.setActiveItem(collection.getItemBySourceKey(2));
            expect(testingItem.isActive()).toBe(false);
        });
        it('activates new active item', () => {
            const testingItem = collection.getItemBySourceKey(2);
            itemActionsController.setActiveItem(collection.getItemBySourceKey(1));
            itemActionsController.setActiveItem(collection.getItemBySourceKey(2));
            expect(testingItem.isActive()).toBe(true);
        });
        it('correctly returns active item', () => {
            const testingItem = collection.getItemBySourceKey(2);
            itemActionsController.setActiveItem(collection.getItemBySourceKey(2));
            expect(itemActionsController.getActiveItem()).toEqual(testingItem);
        });
        it('correctly returns the active item when updating the source', () => {
            const testingItem = collection.getItemBySourceKey(2);
            itemActionsController.setActiveItem(collection.getItemBySourceKey(2));
            // Эмулируем обновление source, при котором activeElement сбрасывается.
            itemActionsController._collection.setActiveItem(undefined);
            expect(itemActionsController.getActiveItem()).toEqual(testingItem);
        });
    });

    describe('startSwipeCloseAnimation()', () => {
        it('should correctly set animation state', () => {
            const testingItem = collection.getItemBySourceKey(1);
            testingItem.setSwipeAnimation('open');
            testingItem.setSwiped(true, true);
            itemActionsController.startSwipeCloseAnimation();
            expect(testingItem.getSwipeAnimation()).toEqual('close');
        });
    });
});
