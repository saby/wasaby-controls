import {
    MutableRefObject,
    ReactElement,
    memo,
    useRef,
    useState,
    useCallback,
    useMemo,
} from 'react';
import { Button } from 'Controls/buttons';
import { default as List } from './List';
import rk = require('i18n!Controls-Colors');
import { Model } from 'Types/entity';
import { applied } from 'Types/entity';
import { IMarkSelectorPanelOptions } from './interfaces/IMarkSelectorPanelOptions';
import { ItemsView } from 'Controls/list';
import { isElementContainsFieldOnArr } from '../utils/function';
import { Container } from 'Controls/scroll';
import 'css!Controls-Colors/colormark';
import { HelpPersonImage, HelpPerson } from 'Hint/Template';

/**
 * Компонент 'Пометки цветом'.
 * Используется в качестве самостоятельного компонента внутри платформенной
 * {@link Controls-Colors/colormarkTemplate:Template раскладки} окна, так же может использоваться внутри прикладной
 * раскладки.
 * Дополнительно смотри: {@link Controls-Colors/colormarkOpener:DialogOpener Xелпер} открытия окна.
 * @class Controls-Colors/colormark:Panel
 * @implements Controls-Colors/colormark:IMarkSelectorPanelOptions
 * @demo Controls-Colors-demo/Panel/Index
 * @example
 * <pre class="brush: js">
 *     const items: TMarkElement[] = [
 *      {
 *         id: '0',
 *         type: 'style',
 *         value: {
 *             color: '--danger_color',
 *             style: {
 *                 b: true,
 *                 i: true,
 *                 u: true,
 *                 s: true,
 *             }
 *         },
 *         caption: 'Красный',
 *         removable: true,
 *         editable: true
 *      },
 *      ...
 *     ];
 *     ...
 *     const [selectedKeys, setSelectedKeys] = useState<TSelectedKeys>(['0']);
 *
 *     const selectedKeysChangeHandler = useCallback((keys) => {
 *         setSelectedKeys(keys);
 *     }, []);
 *     ...
 *     return (
 *      <Panel items={items}
 *             selectedKeys={selectedKeys}
 *             onSelectedKeysChanged={selectedKeysChangeHandler}
 *             ...
 *      />
 *     );
 * </pre>
 * @public
 */
export default memo((props: IMarkSelectorPanelOptions): ReactElement => {
    const { adding = true, addedItemType = 'color', isAdaptive } = props;
    const isMultiSelectMode = useMemo(
        () => props.multiSelect || isElementContainsFieldOnArr('icon', props.items),
        [props.items, props.multiSelect]
    );

    const itemsViewRef: MutableRefObject<ItemsView> = useRef();

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isKeysChanged, setIsKeysChanged] = useState<boolean>(false);

    const addButtonClickHandler = useCallback(() => {
        let shouldBeCalled = true;
        if (props.onBeforeEdit) {
            const result = props.onBeforeEdit(null);
            shouldBeCalled = result !== undefined ? result : true;
        }
        if (shouldBeCalled) {
            const useKeys = props.items.map((item) => {
                return item.value?.color;
            });
            const uniqColor = props.palette.find((elem) => {
                return !useKeys.includes(elem.color);
            });
            const isStyled = addedItemType === 'style';
            const value = {
                color: uniqColor?.color || props.palette?.[0]?.color || '#000000',
            };
            if (isStyled) {
                value.style = {
                    b: false,
                    u: false,
                    i: false,
                    s: false,
                };
            }
            itemsViewRef.current.beginAdd({
                item: new Model({
                    keyProperty: 'id',
                    rawData: {
                        id: applied.Guid.create(),
                        caption: rk('Пометка'),
                        type: isStyled ? 'style' : 'color',
                        value,
                    },
                }),
            });
        }
    }, [props.adding, props.onBeforeEdit, props.palette]);

    const resetButtonClickHandler = useCallback(() => {
        const itemsWithoutDisabled = props.selectedKeys.filter((item) =>
            props.items.find((arrItem) => arrItem.id === item && arrItem.disabled)
        );
        props.onSelectedKeysChanged(itemsWithoutDisabled);
        props.onExcludedKeysChanged?.(itemsWithoutDisabled);
    }, [props.onSelectedKeysChanged, props.onExcludedKeysChanged]);

    const onAfterEndEditHandler = useCallback(() => {
        setIsEditing(false);
        if (props.onAfterEndEdit) {
            props.onAfterEndEdit();
        }
    }, [props.onAfterEndEdit]);

    const onBeforeBeginEditHandler = useCallback(() => {
        setIsEditing(true);
        if (props.onBeforeBeginEdit) {
            props.onBeforeBeginEdit();
        }
    }, [props.onBeforeBeginEdit]);

    const onSelectedKeysChangedHandler = useCallback(
        (...args) => {
            if (!isKeysChanged) {
                setIsKeysChanged(true);
            }
            if (props.onSelectedKeysChanged) {
                props.onSelectedKeysChanged(...args);
            }
        },
        [props.onSelectedKeysChanged]
    );

    const onExcludedKeysChangedHandler = useCallback(
        (...args) => {
            if (!isKeysChanged) {
                setIsKeysChanged(true);
            }
            if (props.onExcludedKeysChanged) {
                props.onExcludedKeysChanged(...args);
            }
        },
        [props.onExcludedKeysChanged]
    );

    const emptyTemplate = useMemo(() => {
        if (props.emptyTemplate) {
            return props.emptyTemplate;
        }
        return (
            <div
                className="controls-text-label tw-flex tw-justify-center tw-flex-col tw-items-center Colormark__Panel__emptyView_title
                           controls-padding_bottom-m controls-padding_top-m controls-padding_left-m controls-padding_right-m"
            >
                <div className="controls-fontsize-4xl">{rk('Здесь пока нет пометок')}</div>
                {adding && rk('Добавляйте новые по кнопке "+"')}
                <HelpPersonImage value={HelpPerson.common.letsSee} size="s" />
            </div>
        );
    }, [props.emptyTemplate, adding]);

    const offsetSize = isAdaptive ? 'm' : 'st';

    return (
        <div
            className={
                'Colormark__Panel tw-flex tw-flex-col tw-min-h-0' +
                ' Colormark__Panel_background' +
                (isEditing ? '_unaccented ' : '_default ') +
                (props.className || '')
            }
        >
            <div
                className={
                    'Colormark__Panel_header' +
                    ' controls-padding_top-' +
                    offsetSize +
                    ' controls-padding_bottom-' +
                    offsetSize +
                    ' Colormark__Panel_header_offset-left_' +
                    (isMultiSelectMode ? 'multiselect' : 'single') +
                    (isAdaptive ? '_adaptive' : '_noAdaptive')
                }
            >
                <div className="tw-flex tw-items-baseline tw-justify-between">
                    <div className="tw-flex tw-items-baseline">
                        <div className="controls-fontweight-bold controls-text-default controls-fontsize-3xl">
                            {rk('Пометки')}
                        </div>
                        {adding && (isAdaptive ? !isEditing : true) && (
                            <Button
                                className={
                                    'controls-margin_left-m' +
                                    ' Colormark__Panel_addButton' +
                                    (isAdaptive ? '_adaptive' : '_default')
                                }
                                data-qa="Controls-Colors_colormark_Panel__addButton"
                                icon={'icon-' + (isAdaptive ? 'Plus2' : 'AddForSectoinOfAccordion')}
                                iconStyle={isAdaptive ? 'contrast' : 'default'}
                                iconSize={isAdaptive ? 'l' : 'default'}
                                viewMode="filled"
                                buttonStyle={isAdaptive ? 'brand' : 'pale'}
                                inlineHeight={isAdaptive ? '7xl' : 'm'}
                                onClick={addButtonClickHandler}
                                readOnly={isEditing}
                            />
                        )}
                    </div>
                    {(!!props.selectedKeys.length || !!props.excludedKeys?.length) &&
                        props.items.some(
                            (item) =>
                                !item.disabled &&
                                (props.selectedKeys.some((key) => item.id === key) ||
                                    props.excludedKeys?.some?.((key) => item?.id === key))
                        ) && (
                            <Button
                                className={
                                    'controls-margin_left-m' +
                                    ' Colormark__Panel_resetButton-offset' +
                                    (isKeysChanged ? '_m' : '_s') +
                                    (isAdaptive ? '_adaptive' : '_default')
                                }
                                data-qa="Controls-Colors_colormark_Panel__resetButton"
                                viewMode="link"
                                fontColorStyle="label"
                                fontSize={isAdaptive ? 's' : 'xs'}
                                onClick={resetButtonClickHandler}
                                caption={rk('Сбросить')}
                                readOnly={isEditing}
                            />
                        )}
                </div>
            </div>
            <Container className="tw-h-full" data-qa="Controls-Colors_colormark_Panel__scroll">
                <div className="Colormark__Panel_content">
                    <List
                        forwardedRef={itemsViewRef}
                        items={props.items}
                        palette={props.palette}
                        selectedKeys={props.selectedKeys}
                        excludedKeys={props.excludedKeys}
                        excludable={props.excludable}
                        multiSelect={props.multiSelect}
                        isAdaptive={isAdaptive}
                        emptyTemplate={emptyTemplate}
                        onAfterEndEdit={onAfterEndEditHandler}
                        onBeforeBeginEdit={onBeforeBeginEditHandler}
                        onBeforeEndEdit={props.onBeforeEndEdit}
                        onSelectedKeysChanged={onSelectedKeysChangedHandler}
                        onExcludedKeysChanged={onExcludedKeysChangedHandler}
                        onBeforeSelectionChanged={props.onBeforeSelectionChanged}
                        onBeforeEdit={props.onBeforeEdit}
                        onBeforeDelete={props.onBeforeDelete}
                        footerTemplate={props.footerTemplate}
                        addedItemType={addedItemType}
                    />
                </div>
            </Container>
        </div>
    );
});
