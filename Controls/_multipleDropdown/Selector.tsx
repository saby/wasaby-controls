import * as React from 'react';
import {
    inputDefaultContentTemplate as DropdownTemplate,
    _Controller,
    getDropdownControllerOptions,
    getTextSelector,
    IDropdownControllerOptions,
} from 'Controls/dropdown';
import { useReadonly } from 'UI/Contexts';
import { IIconSizeOptions, IIconStyleOptions, IUnderlineOptions, TKey } from 'Controls/interface';
import { Model } from 'Types/entity';
import { isLeftMouseButton } from 'Controls/popup';
import { StickyOpener } from 'Controls/popup';

interface IMultipleDropdown extends IUnderlineOptions, IIconSizeOptions, IIconStyleOptions {
    /**
     * @name Controls/multipleDropdown:Selector#menuConfigs
     * @cfg {Record<string, IDropdownConfigArgs>} Настройки для каждого меню.
     * @example
     * <pre>
     *     menuConfigs = {
     *         traffic: {
     *             items: ...,
     *             displayProperty: 'title',
     *             headingCaption: rk('вид сообщения'),
     *         },
     *         transportation: {
     *             items: ...,
     *             displayProperty: 'name',
     *             headingCaption: rk('вид перевозки'),
     *         }
     *     }
     * </pre>
     */
    menuConfigs: Record<string, IDropdownConfigArgs>;
    /**
     * @name Controls/multipleDropdown:Selector#selectedKeys
     * @cfg {Record<string, TKey>} Выбранные ключи.
     * @example
     * <pre>
     *     selectedKeys = {
     *         traffic: ['key1'],
     *         transportation: ['key3']
     *     }
     * </pre>
     */
    selectedKeys: Record<string, TKey[]>;
    /**
     * @name Controls/multipleDropdown:Selector#onSelectedKeysChanged
     * @cfg {Function} Обработчик изменения выбранных записей.
     * @example
     * <pre>
     *     onSelectedKeysChanged = React.useCallback((newKeys) => {
     *         ....
     *         setSelectedKeysChanged(newKeys);
     *     }, []);
     */
    onSelectedKeysChanged: (selectedKeys: Record<string, TKey[]>) => {};
    onMouseDown?: Function;
    closeMenuOnOutsideClick?: boolean;
    /**
     * @name Controls/multipleDropdown:Selector#maxVisibleItems
     * @cfg {Number} Максимальное количество выбранных записей, которые будут отображены. Остальные записи скрываются и заменяются на ", еще N".
     */
    maxVisibleItems?: number;
}

interface IDropdownConfigArgs {
    caption?: string;
}

function getDropdownConfigs(
    menuNames: string[],
    controllers: Record<string, _Controller>,
    props: IMultipleDropdown
): IMultipleContent {
    let selectedItems = [];
    let textValues: string[] = [];
    let text;
    let tooltip;
    let hasMoreText;
    let item;
    const isEmptyTextSelected = (name) => {
        return (
            !!props.menuConfigs[name].emptyText &&
            (!props.selectedKeys ||
                !props.selectedKeys[name] ||
                !props.selectedKeys[name].length ||
                props.selectedKeys[name].includes(props.menuConfigs[name].emptyKey || null))
        );
    };

    if (!props.selectedKeys || !Object.values(props.selectedKeys).flat().length) {
        // Ни в одном меню ничего не выбрано
        menuNames.forEach((name) => {
            if (props.menuConfigs[name].caption) {
                textValues.push(
                    props.menuConfigs[name].caption || props.menuConfigs[name].emptyText
                );
            }
        });
        text = textValues.join(', ');
        tooltip = text;
        hasMoreText = '';
    } else {
        menuNames.forEach((menuName, index) => {
            const menuConfig = props.menuConfigs[menuName];
            selectedItems = controllers[menuName].getSelectedItems();
            if (isEmptyTextSelected(menuName)) {
                textValues = textValues.concat(menuConfig.emptyText || menuConfig.caption);
            } else {
                textValues = textValues.concat(
                    getTextSelector.getFullTexts(selectedItems, menuConfig, controllers[menuName])
                );
            }
            item = !index && selectedItems[0];
        });
        let textValuesVisible = textValues;
        if (props.maxVisibleItems) {
            textValuesVisible = textValues.slice(0, props.maxVisibleItems);
        }
        text = textValuesVisible.join(', ');
        tooltip = textValues.join(', ');
        hasMoreText = getTextSelector.getMoreText(textValues, props.maxVisibleItems);
    }
    return {
        text,
        icon: item && item.get('icon'),
        item,
        iconStyle: props.iconStyle,
        tooltip,
        iconSize: props.iconSize,
        underline: props.underline,
        hasMoreText,
    };
}

/**
 * Контрол объединенное меню.
 * @class Controls/multipleDropdown:Selector
 *
 * @public
 * @demo Controls-demo/dropdown_new/Multiple/Simple/Index
 */
function MultipleDropdown(props: IMultipleDropdown): JSX.Element {
    const readOnly = useReadonly(props);
    const targetRef = React.useRef(null);
    const popupOpener = React.useRef<StickyOpener>(null);

    const menuNames = React.useMemo(
        () =>
            Object.keys(props.menuConfigs).sort(
                (name1, name2) =>
                    (props.menuConfigs[name1].order || 0) - (props.menuConfigs[name2].order || 0)
            ),
        [props.menuConfigs]
    );

    const controllers = React.useMemo(() => {
        const controllersMap: Record<string, _Controller> = {};
        menuNames.forEach((menuName) => {
            controllersMap[menuName] = new _Controller(getControllerOptions(props, menuName));
        });
        return controllersMap;
    }, []);

    const [dropdownConfigs, setDropdownConfigs] = React.useState(
        getDropdownConfigs(menuNames, controllers, props)
    );

    React.useEffect(() => {
        menuNames.forEach((menuName) => {
            const updateResult = controllers[menuName].update(
                getControllerOptions(props, menuName)
            );
            if (updateResult instanceof Promise) {
                updateResult.then(() =>
                    setDropdownConfigs(getDropdownConfigs(menuNames, controllers, props))
                );
            } else {
                setDropdownConfigs(getDropdownConfigs(menuNames, controllers, props));
            }
        });
    }, [props.selectedKeys, props.menuConfigs]);

    const onResultHandler = React.useCallback((actionName, data) => {
        switch (actionName) {
            case 'applyClick':
                props.onSelectedKeysChanged?.(data.selection?.selected);
                popupOpener.current?.close();
                break;
        }
    }, []);

    const openMenu = React.useCallback(
        (event) => {
            if (props.onMouseDown) {
                props.onMouseDown(event);
            }
            if (!isLeftMouseButton(event) || readOnly) {
                return;
            }
            const promises = [];
            Object.keys(controllers).forEach((name) => {
                promises.push(controllers[name].loadDependencies());
            });

            const className = props.menuConfigs[menuNames[0]]?.multiSelect
                ? 'controls-DropdownList_multiSelect__margin'
                : 'controls-DropdownList__margin';

            const menuTemplateConfigs = {};
            menuNames.forEach((name) => {
                menuTemplateConfigs[name] = {
                    ...getDropdownControllerOptions(props.menuConfigs[name]),
                    markerVisibility: 'onactivated',
                    emptyKey: props.menuConfigs[name].emptyKey || null,
                };
            });

            Promise.all(promises).then(() => {
                if (!popupOpener.current) {
                    popupOpener.current = new StickyOpener();
                }
                const selectedKeys = props.selectedKeys || {};
                menuNames.forEach((name) => {
                    if (
                        (!props.selectedKeys || !props.selectedKeys[name]?.length) &&
                        !!props.menuConfigs[name].emptyText
                    ) {
                        selectedKeys[name] = [props.menuConfigs[name].emptyKey || null];
                    }
                });
                popupOpener.current.open({
                    opener: targetRef.current,
                    target: targetRef.current,
                    actionOnScroll: 'close',
                    fittingMode: {
                        vertical: 'adaptive',
                        horizontal: 'overflow',
                    },
                    className,
                    autofocus: false,
                    closeOnOutsideClick: props.closeMenuOnOutsideClick,
                    template: 'Controls/menu:Popup',
                    templateOptions: {
                        menuConfigs: menuTemplateConfigs,
                        selectedKeys,
                        multiSelect: true,
                    },
                    eventHandlers: {
                        onResult: onResultHandler,
                    },
                });
            });
        },
        [
            props.onMouseDown,
            props.closeMenuOnOutsideClick,
            props.menuConfigs,
            targetRef.current,
            props.selectedKeys,
            onResultHandler,
        ]
    );

    return (
        <ContentTemplate
            ref={targetRef}
            {...dropdownConfigs}
            underline={props.underline}
            onMouseDown={openMenu}
            className={props.className || props.attrs?.className}
            attrs={props.attrs}
        />
    );
}

interface IMultipleContent extends IUnderlineOptions {
    text: string;
    icon?: string;
    item?: Model;
    iconStyle?: string;
    tooltip?: string;
    iconSize?: string;
    hasMoreText?: string;
}

const ContentTemplate = React.forwardRef((props: IMultipleContent, ref) => {
    return (
        <DropdownTemplate
            ref={ref}
            onMouseDown={props.onMouseDown}
            text={props.text}
            tooltip={props.tooltip}
            hasMoreText={props.hasMoreText}
            underline={props.underline}
            className={props.className}
            attrs={props.attrs}
        ></DropdownTemplate>
    );
});

function getControllerOptions(
    props: IMultipleDropdown,
    menuName: string
): IDropdownControllerOptions {
    const selectedKeys = props.selectedKeys?.[menuName] || [];
    const config = props.menuConfigs[menuName];
    const controllerOptions = getDropdownControllerOptions(config);
    return {
        ...controllerOptions,
        ...{
            markerVisibility: 'onactivated',
            // dataLoadCallback: this._dataLoadCallback,
            selectedKeys,
            allowPin: false,
            // selectedItemsChangedCallback: this._prepareDisplayState,
            // selectorDialogResult: this._selectorTemplateResult,
        },
    };
}

MultipleDropdown.defaultProps = {
    closeMenuOnOutsideClick: true,
    underline: 'hovered',
};
export default MultipleDropdown;
