import {MutableRefObject, ReactElement, memo, useRef, useState, useCallback, useMemo, useContext} from 'react';
import {IMarkSelectorOptions} from './interfaces/IMarkSelectorOptions';
import {ItemsView, ItemTemplate, EditingTemplate} from 'Controls/list';
import {IItemAction} from 'Controls/itemActions';
import {showType} from 'Controls/toolbars';
import {Confirmation, StickyOpener} from 'Controls/popup';
import {Sticky as StickyTemplate} from 'Controls/popupTemplate';
import {Panel} from 'ExtControls/colorPicker';
import {Text as TextInput} from 'Controls/input';
import {RecordSet} from 'Types/collection';
import {Model} from 'Types/entity';
import {IAction} from 'Controls/interface';
import rk = require('i18n!Controls-Colors');
import {getColor, getStyleClasses, isElementContainsFieldOnArr} from '../utils/function';
import {EditingContext} from './contexts/contexts';
import 'css!Controls-Colors/colormark';

interface IListOptions extends IMarkSelectorOptions {
    onBeforeBeginEdit?: (args) => void;
    onAfterEndEdit?: (args) => void;
    forwardedRef: MutableRefObject<ItemsView>;
}

const KEY_PROPERTY = 'id';
const BASE_COLUMNS_COUNT = 5;
let sticky;

export default memo((props: IListOptions): ReactElement => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const isMultiSelectMode = useMemo(() => isElementContainsFieldOnArr('icon', props.items), [props.items]);
    const itemsViewRef: MutableRefObject<ItemsView> = useRef();
    const editingConfig = useMemo(() => {
        return {toolbarVisibility: true, backgroundStyle: 'colormark_list'};
    }, [props.items]);

    const itemPadding = useMemo(() => {
        return {
            top: 's',
            bottom: 's',
            left: isMultiSelectMode ? 'null' : 'default'
        };
    }, [isMultiSelectMode]);

    const itemActions = useMemo(() => {
        return [
            {
                id: 'edit',
                icon: 'icon-Edit',
                showType: showType.TOOLBAR,
                iconStyle: 'secondary',
                tooltip: rk('Редактировать')
            },
            {
                id: 'remove',
                icon: 'icon-Erase',
                showType: showType.TOOLBAR,
                iconStyle: 'danger',
                tooltip: rk('Удалить')
            }
        ];
    }, [props.items]);

    const itemsView = useMemo(() => {
        return new RecordSet({
            keyProperty: KEY_PROPERTY,
            rawData: props.items
        });
    }, [props.items]);

    const actionClickHandler = useCallback((action: IAction, item: Model) => {
        const params = {
            item
        };
        if (action.id === 'edit') {
            let shouldBeCalled = true;
            if (props.onBeforeEdit) {
                const result = props.onBeforeEdit(params);
                shouldBeCalled = result !== undefined ? result : true;
            }
            if (shouldBeCalled) {
                itemsViewRef.current.beginEdit(params);
            }
        }
        if (action.id === 'remove') {
            let shouldBeCalled = true;
            if (props.onBeforeDelete) {
                const result = props.onBeforeDelete(params);
                shouldBeCalled = result !== undefined ? result : true;
            }
            if (shouldBeCalled) {
                Confirmation.openPopup({
                    type: 'yesno',
                    message: rk('Удалить пометку') + ' "' + item.get('caption') + '"?',
                    details: rk('Эта пометка будет снята со всех отмеченных записей')
                }).then((res) => {
                    if (res) {
                        itemsView.remove(item);
                    }
                });
            }
        }
    }, [props.onBeforeEdit, props.onBeforeDelete]);

    const itemActionVisibilityCallback =
        useCallback((itemAction: IItemAction, item: Model, isEditing: boolean) => {
            if (itemAction.id === 'edit') {
                if (item.get('editable') === false) {
                    return false;
                }
            }
            if (itemAction.id === 'remove') {
                if (item.get('removable') === false) {
                    return false;
                }
            }
            return !isEditing;
    }, [props.items]);

    const selectedKeysChangedHandler =
        useCallback((currentSelectedKeys: string | string[], addedKey: string[]) => {
        let keys = Array.isArray(currentSelectedKeys) ? currentSelectedKeys : [currentSelectedKeys];
        if (isMultiSelectMode) {
            if (props.onBeforeSelectionChanged) {
                keys = props.onBeforeSelectionChanged(keys);
            } else {
                const isNewItemForType = !!addedKey.length && !!itemsView.getRecordById(addedKey[0]).get('type');
                if (isNewItemForType) {
                    const oldSelectedKeys = (currentSelectedKeys as string[]).filter((key) => key !== addedKey[0]);
                    const selectedKeyForType = oldSelectedKeys.find((key) => !!itemsView.getRecordById(key).get('type'));
                    if (selectedKeyForType !== undefined) {
                        keys.splice(currentSelectedKeys.indexOf(selectedKeyForType), 1);
                    }
                }
            }
        }
        props.onSelectedKeysChanged(keys);
    }, [props.onBeforeSelectionChanged, props.onSelectedKeysChanged, itemsView]);

    const afterEndEditHandler = useCallback((args) => {
        setIsEditing(false);
        if (props.onAfterEndEdit) {
            props.onAfterEndEdit(args);
        }
    }, [props.onAfterEndEdit]);
    const beforeBeginEditHandler = useCallback((args) => {
        setIsEditing(true);
        if (props.onBeforeBeginEdit) {
            props.onBeforeBeginEdit(args);
        }
    }, [props.onBeforeBeginEdit]);

    const setRef = useCallback((node) => {
        if (!node) {
            return;
        }
        itemsViewRef.current = node;
        props.forwardedRef.current = node;
    }, []);

    return (
        <EditingContext.Provider value={isEditing}>
            <div className={'Colormark__List_container' + (isEditing ? '_blackout ' : ' ') + props.className}>
                <ItemsView ref={setRef}
                           editingConfig={editingConfig}
                           itemPadding={itemPadding}
                           items={itemsView}
                           itemActions={itemActions}
                           onActionClick={actionClickHandler}
                           onAfterEndEdit={afterEndEditHandler}
                           onBeforeBeginEdit={beforeBeginEditHandler}
                           customEvents={['onActionClick', 'onAfterEndEdit', 'onBeforeBeginEdit']}
                           keyProperty={KEY_PROPERTY}
                           displayProperty="caption"
                           markedKey={props.selectedKeys[0]}
                           selectedKeys={props.selectedKeys}
                           excludedKeys={props.excludedKeys}
                           onSelectedKeysChanged={selectedKeysChangedHandler}
                           itemActionVisibilityCallback={itemActionVisibilityCallback}
                           onMarkedKeyChanged={selectedKeysChangedHandler}
                           itemActionsPosition="custom"
                           multiSelectVisibility={isMultiSelectMode ? 'onhover' : 'hidden'}
                           markerVisibility={isMultiSelectMode ? 'hidden' : 'onactivated'}
                           multiSelectPosition={isMultiSelectMode ? 'custom' : 'default'}
                           itemActionsClass="Colormark__List_itemActionsPosition"
                           emptyTemplate={useCallback(() => {
                               return (
                                   <div className="controls-text-label tw-flex tw-justify-center
                                                   controls-padding_bottom-m controls-padding_top-m">
                                       {
                                           rk('Список пометок пуст')
                                       }
                                   </div>
                               );
                           }, [])}
                           itemTemplate={useCallback((itemTemplateProps) => {
                               return <ItemTemplateList itemTemplateProps={itemTemplateProps}
                                                        palette={props.palette}
                               />;
                           }, [props.palette])}
                />
            </div>
        </EditingContext.Provider>
    );
});

export function PaletteTemplate(props) {
    return (
        <StickyTemplate closeButtonVisible={false}
                        shadowVisible={true}
                        bodyContentTemplate={useCallback(() => {
            return (
                <Panel keyProperty="color"
                       columnsCount={BASE_COLUMNS_COUNT}
                       items={props.palette}
                       selectedKey={props.item.get('value').color}
                       onSelectedKeyChanged={props.onSelectedKeyChanged}
                       customEvents={['onSelectedKeyChanged']}
                       className="Colormark__List__insideOffset"
                />
            );
        }, [])}
        />
    );
}
PaletteTemplate.isReact = true;

function Bubble(props) {
    const bubbleNode: MutableRefObject<HTMLDivElement> = useRef();
    const colorButtonValueChangeHandler = useCallback((value) => {
        props.item.set('value', {
            ...props.item.get('value'),
            color: value
        });
        sticky.close();
    }, []);
    const clickHandler = useCallback(() => {
        if (!sticky) {
            sticky = new StickyOpener({});
        }
        sticky.open({
            template: 'Controls-Colors/_colormark/List:PaletteTemplate',
            target: bubbleNode.current,
            opener: bubbleNode.current,
            targetPoint: {
                horizontal: 'left',
                vertical: 'top',
            },
            fittingMode: {
                vertical: 'overflow',
            },
            className: 'Colormark__List__panelOffset',
            closeOnOutsideClick: true,
            templateOptions: {
                palette: props.palette,
                item: props.item,
                onSelectedKeyChanged: colorButtonValueChangeHandler,
            }

    });
    }, [props.item, props.palette]);
    const getStyle = useCallback(() => {
        return {
            backgroundColor: getColor(props.item)
        };
    }, [props.item]);
    return (
        <div className={'controls-margin_left-' + props.leftPadding +
                        ' controls-margin_right-m tw-flex-shrink-0 Colormark__List_Bubble' +
                        ' Colormark__List_Bubble' + (props.readOnly ? '_disabled' : '_enabled')}
             style={getStyle()}
             onClick={clickHandler}
             ref={bubbleNode}
        >
        </div>
    );
}

function EditorTemplate ({
     editingTemplateProps,
     itemsPaletteView,
     itemActionsTemplate,
     multiSelectTemplate
}) {
    const item: Model = editingTemplateProps.item.contents;
    const itemStyleMode = item.get('type') === 'style' ? 'style' : 'color';
    const CustomItemActionsTemplate = itemActionsTemplate;
    const MultiSelectTemplate = multiSelectTemplate;
    const inputValueChangeHandler = useCallback((value) => item.set('caption', value), []);
    return (
        <EditingTemplate {...editingTemplateProps}
                         value={item.get('caption')}
                         editorTemplate={useCallback(() => {
                             const getInputClassName = () => {
                                 let result = item.get('type') === 'color' ? 'Colormark__List_inputOffset ' : ' ';
                                 if (item.get('type') === 'style') {
                                     result += getStyleClasses(item.get('value').style);
                                 }
                                 return result;
                             };
                             const getStyles = () => {
                                 let styles = {};
                                 if (item.get('type') === 'style') {
                                     const currentColor = getColor(item);
                                     styles = {
                                         color: currentColor,
                                         borderColor: currentColor
                                     };
                                 }
                                 return styles;
                             };
                             return (
                                 <div className="Colormark__List_editorTemplate">
                                     <div className="tw-flex tw-items-center controls-padding_left-s">
                                         {
                                             editingTemplateProps.item.getMultiSelectVisibility() === 'onhover' && (
                                                 <span className="Colormark__List_item_customCheckbox">
                                                    <MultiSelectTemplate/>
                                                 </span>
                                             )
                                         }
                                         <Bubble item={item}
                                                 palette={itemsPaletteView}
                                                 leftPadding={editingTemplateProps.item.getMultiSelectVisibility() ===
                                                                                               'onhover' ? 'xs' : 'none'}
                                         />
                                         <TextInput value={item.get('caption')}
                                                    customEvents={['onValueChanged']}
                                                    className={getInputClassName()}
                                                    onValueChanged={inputValueChangeHandler}
                                                    fontWeight="none"
                                                    fontSize="l"
                                                    attrs={{ style: getStyles()}}
                                         />
                                         {
                                             itemStyleMode === 'color' && <CustomItemActionsTemplate actionPadding={'colormark'}/>
                                         }
                                     </div>
                                     {
                                         itemStyleMode === 'style' && (
                                             <div className={'Colormark__List_editorTemplate_styleSettings' +
                                                 (editingTemplateProps.item.getMultiSelectVisibility() === 'onhover' ?
                                                 ' controls-margin_left-3xl' : '')
                                             }>
                                                 <StyleSettings settings={item.get('value').style}
                                                                onSettingsChanged={(newSettings) => {
                                                                    item.set('value', {
                                                                        ...item.get('value'),
                                                                        style: newSettings
                                                                    });
                                                                }}
                                                 />
                                                 <CustomItemActionsTemplate actionPadding={'colormark'}/>
                                             </div>
                                         )
                                     }
                                 </div>
                             );
                         }, [])}
        />
    );
}

function ViewTemplate ({ editingTemplateProps, itemActionsTemplate, multiSelectTemplate }) {
    const isEditing = useContext(EditingContext);
    const item: Model = editingTemplateProps.item.contents;
    let styles = {};
    if (item.get('type') === 'style') {
        const currentColor = getColor(item);
        styles = {
            color: isEditing && !editingTemplateProps.item.isEditing() ? 'var(--readonly_text-color)' : currentColor,
            borderColor: isEditing && !editingTemplateProps.item.isEditing() ? 'var(--readonly_text-color)' : currentColor,
        };
    }
    const CustomItemActionsTemplate = itemActionsTemplate;
    const MultiSelectTemplate = multiSelectTemplate;
    const isCustomElement = item.get('icon');
    const getIconClasses = () => {
        return (
            'controls-icon_size-' + (item.get('iconSize') || 'm') +
            ' controls-icon_style-' + (item.get('iconStyle') || 'secondary') +
            ' icon-' + item.get('icon')
        );
    };
    return (
        <div className="Colormark__List_item tw-flex tw-items-center"
        >
            {
                editingTemplateProps.item.getMultiSelectVisibility() === 'onhover' && (
                    <span className="Colormark__List_item_customCheckbox">
                        <MultiSelectTemplate/>
                    </span>
                )
            }
            {
                isCustomElement ?
                    (
                        <>
                            <div className={'controls-icon controls-margin_right-xs ' + getIconClasses()}></div>
                            <span className={'ws-ellipsis controls-fontsize-l controls-text-' +
                                (isEditing && !editingTemplateProps.item.isEditing() ? 'readonly' : 'default')
                            }
                            >
                                {
                                    item.get('caption')
                                }
                            </span>
                        </>
                    ) :
                    (
                        <>
                            <Bubble item={item}
                                    readOnly={true}
                                    leftPadding={editingTemplateProps.item.getMultiSelectVisibility() === 'onhover' ?
                                                                                                           'xs' : 'none'}
                            />
                            <span className={'ws-ellipsis controls-fontsize-l ' + (isEditing &&
                                             !editingTemplateProps.item.isEditing() ? 'controls-text-readonly ' : ' ') +
                                         (item.get('type') === 'style' ? getStyleClasses(item.get('value').style) : '')}
                                  style={styles}
                            >
                                {
                                    item.get('caption')
                                }
                            </span>
                            <CustomItemActionsTemplate/>
                        </>
                    )
            }
        </div>
    );
}

function EditingTemplateList ({contentTemplateProps, palette}) {
    const itemsPaletteView = useMemo(() => {
        return new RecordSet({
            keyProperty: 'color',
            rawData: palette
        });
    }, [palette]);
    return (
        <EditingTemplate {...contentTemplateProps}
                         viewTemplate={useCallback((editingTemplateProps) => {
                             return (
                                 <ViewTemplate {...contentTemplateProps}
                                               editingTemplateProps={editingTemplateProps}
                                 />
                             );
                         }, [contentTemplateProps.itemActionsTemplate, contentTemplateProps.multiSelectTemplate])}
                         editorTemplate={useCallback((editingTemplateProps) => {
                             return (
                                 <EditorTemplate {...contentTemplateProps}
                                                 editingTemplateProps={editingTemplateProps}
                                                 itemsPaletteView={itemsPaletteView}
                                 />
                             );
                         }, [contentTemplateProps.itemActionsTemplate, contentTemplateProps.multiSelectTemplate])}
        />
    );
}

function ItemTemplateList({itemTemplateProps, palette}) {
    const isEditing = useContext(EditingContext);
    return (
        <ItemTemplate {...itemTemplateProps}
                      className={isEditing && !itemTemplateProps.item.isEditing() ? 'Colormark__List_item_disabled' : ''}
                      contentTemplate={useCallback((contentTemplateProps) => {
                          return <EditingTemplateList contentTemplateProps={contentTemplateProps} palette={palette}/>;
                      }, [isEditing])}
        />
    );
}

function StyleSettings({settings, onSettingsChanged}) {
    const {b = false, u = false, i = false, s = false} = settings;
    const styleButtonClickHandler = useCallback((actionName) => {
        const newSettings = {b, u, i, s};
        newSettings[actionName] = !settings[actionName];
        onSettingsChanged(newSettings);
    }, [settings, onSettingsChanged]);

    return (
        <div className="Colormark__List_styleSettings_container">
            <div className="tw-flex">
                <div className={'controls-icon controls-icon_size-default icon-Bold' +
                    ' controls-margin_right-s controls-icon_style-' + (b ? 'secondary' : 'unaccented')
                }
                     onClick={() => styleButtonClickHandler('b')}
                     title={rk('Жирность')}
                ></div>
                <div className={'controls-icon controls-icon_size-default icon-Underline' +
                    ' controls-margin_right-s controls-icon_style-' + (u ? 'secondary' : 'unaccented')
                }
                     onClick={() => styleButtonClickHandler('u')}
                     title={rk('Подчеркнутый')}
                ></div>
                <div className={'controls-icon controls-icon_size-default icon-Italic' +
                    ' controls-margin_right-s controls-icon_style-' + (i ? 'secondary' : 'unaccented')
                }
                     onClick={() => styleButtonClickHandler('i')}
                     title={rk('Курсив')}
                ></div>
                <div className={'controls-icon controls-icon_size-default icon-Stroked' +
                    ' controls-margin_right-s controls-icon_style-' + (s ? 'secondary' : 'unaccented')
                }
                     onClick={() => styleButtonClickHandler('s')}
                     title={rk('Зачеркнутый')}
                ></div>
            </div>
        </div>
    );
}
