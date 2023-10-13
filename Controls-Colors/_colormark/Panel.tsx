import { MutableRefObject, ReactElement, memo, useRef, useState, useCallback, useMemo } from 'react';
import {Button} from 'Controls/buttons';
import {default as List} from './List';
import rk = require('i18n!Controls-Colors');
import {Model} from 'Types/entity';
import {applied} from 'Types/entity';
import { IMarkSelectorPanelOptions } from './interfaces/IMarkSelectorPanelOptions';
import {ItemsView} from 'Controls/list';
import {isElementContainsFieldOnArr} from '../utils/function';
import {Container} from 'Controls/scroll';
import 'css!Controls-Colors/colormark';

/**
 * Компонент "Пометки цветом"
 * @class Controls-Colors/colormark:Panel
 * @implements Controls-Colors/colormark:IMarkSelectorPanelOptions
 * @demo Controls-Colors-demo/Panel/Index
 * @public
 */
export default memo((props: IMarkSelectorPanelOptions): ReactElement => {
    const {
        adding = true,
        addedItemType = 'color'
    } = props;
    const isMultiSelectMode = useMemo(() => isElementContainsFieldOnArr('icon', props.items), [props.items]);

    const itemsViewRef: MutableRefObject<ItemsView> = useRef();

    const [isEditing, setIsEditing] = useState<boolean>(false);

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
                color: uniqColor?.color || '#000000'
            };
            if (isStyled) {
                value.style = {
                    b: false,
                    u: false,
                    i: false,
                    s: false
                };
            }
            itemsViewRef.current.beginAdd({
                item: new Model({
                    keyProperty: 'id',
                    rawData: {
                        id: applied.Guid.create(),
                        caption: rk('Пометка'),
                        type: isStyled ? 'style' : 'color',
                        value
                    },
                }),
            });
        }
    }, [props.adding, props.onBeforeEdit, props.palette]);

    const resetButtonClickHandler = useCallback(() => {
        props.onSelectedKeysChanged([]);
    }, [props.onSelectedKeysChanged]);

    const onAfterEndEditHandler = useCallback(() => {
        setIsEditing(false);
    }, []);

    const onBeforeBeginEditHandler = useCallback(() => {
        setIsEditing(true);
    }, []);

    return (
        <div className={'Colormark__Panel tw-flex tw-flex-col tw-min-h-0' +
                        ' controls-background-' + (isEditing ? 'unaccented ' : 'default ') + props.className}
        >
            <div className={'Colormark__Panel_header controls-padding_top-st ' +
                            'controls-padding_left-' + (isMultiSelectMode ? 'xl' : 'm')}
            >
                <div className="tw-flex tw-items-baseline">
                    <div className="controls-fontweight-bold controls-text-default controls-fontsize-3xl">
                        {rk('Пометки')}
                    </div>
                    {
                        adding && (
                            <Button className="controls-margin_left-m"
                                    icon="icon-Addition"
                                    iconStyle="default"
                                    viewMode="filled"
                                    buttonStyle="pale"
                                    inlineHeight="m"
                                    onClick={addButtonClickHandler}
                                    readOnly={isEditing}
                            />
                        )
                    }
                    {
                        !!props.selectedKeys.length && (
                            <Button className="controls-margin_left-m"
                                    viewMode="link"
                                    fontColorStyle="label"
                                    fontSize="xs"
                                    onClick={resetButtonClickHandler}
                                    caption={rk('Сбросить')}
                                    readOnly={isEditing}
                            />
                        )
                    }
                </div>
            </div>
            <Container className='tw-h-full'>
                <div className="Colormark__Panel_content">
                    <List forwardedRef={itemsViewRef}
                          items={props.items}
                          palette={props.palette}
                          selectedKeys={props.selectedKeys}
                          excludedKeys={props.excludedKeys}
                          onAfterEndEdit={onAfterEndEditHandler}
                          onBeforeBeginEdit={onBeforeBeginEditHandler}
                          onBeforeEndEdit={props.onBeforeEndEdit}
                          onSelectedKeysChanged={props.onSelectedKeysChanged}
                          onBeforeSelectionChanged={props.onBeforeSelectionChanged}
                          onBeforeEdit={props.onBeforeEdit}
                          onBeforeDelete={props.onBeforeDelete}
                    />
                </div>
            </Container>
        </div>
    );
});
