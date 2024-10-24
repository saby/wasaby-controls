/**
 * @kaizen_zone 0e777c01-152f-4167-9433-47d6c6075bcc
 */
import * as React from 'react';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import { SyntheticEvent } from 'Vdom/Vdom';
import { descriptor as EntityDescriptor, Model, Record } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { CrudWrapper } from 'Controls/dataSource';
import ItemTemplate from './_RadioGroup/resources/ItemTemplate';
import GroupTemplate from './_RadioGroup/GroupTemplate';
import switchCircleTemplate from './_RadioGroup/resources/RadioCircle/RadioCircle';
import {
    ISource,
    ISourceOptions,
    ISingleSelectable,
    ISingleSelectableOptions,
    IHierarchyOptions,
    TSelectedKey,
    IToggleGroup,
    IToggleGroupOptions,
    IControlProps,
} from 'Controls/interface';
import { TInternalProps } from 'UICore/executor';
import { constants } from 'Env/Env';
import { getWasabyContext } from 'UICore/Contexts';
import 'css!Controls/RadioGroup';
import 'css!Controls/CommonClasses';

export interface IRadioGroupProps
    extends TInternalProps,
        IControlProps,
        ISingleSelectableOptions,
        IHierarchyOptions,
        ISourceOptions,
        ISource,
        ISingleSelectable,
        IToggleGroup,
        IToggleGroupOptions {
    captionPosition?: 'start' | 'end';
    radioCircleVisible?: boolean;
    items?: RecordSet;
    multiline?: boolean;
    itemClassName?: string;
    readOnly?: boolean;
    theme?: string;
    className?: string;
    validationStatus?: string;
    displayProperty?: string;
    onSelectedkeychanged?: (event: SyntheticEvent, selectedKey: TSelectedKey) => void;
    onSelectedKeyChanged?: (event: SyntheticEvent, selectedKey: TSelectedKey) => void;
    onBlur?: (event: SyntheticEvent) => void;
}

interface IRadioGroupState {
    items: RecordSet;
    groups: IGroups;
    selectedKey: string | number;
    markedKey: string | number;
}

export interface IGroups {
    [key: string]: IGroupsItem;
}

interface IGroupsItem {
    items: Model[];
    selectedKey?: string;
}

/**
 * Группа контролов, которые предоставляют пользователям возможность выбора между двумя или более параметрами.
 *
 * @remark
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2Ftoggle%2FRadioGroup%2FIndex демо-пример}
 * * {@link https://git.sbis.ru/saby/wasaby-controls/-/blob/rc-24.6100/Controls-default-theme/variables/_toggle.less переменные тем оформления}
 *
 * @class Controls/RadioGroup:Control
 * @implements Controls/interface:ISingleSelectable
 * @implements Controls/interface:IValidationStatus
 * @implements Controls/interface:IHierarchy
 * @implements Controls/interface:IToggleGroup
 *
 * @public
 * @demo Controls-demo/toggle/RadioGroup/Base/Index
 */
export class Control extends React.Component<IRadioGroupProps, IRadioGroupState> {
    protected _crudWrapper: CrudWrapper;

    constructor(props: IRadioGroupProps) {
        super(props);
        this._selectKeyChanged = this._selectKeyChanged.bind(this);
        this._markedKeyChanged = this._markedKeyChanged.bind(this);
        this._isSelected = this._isSelected.bind(this);
        this._isMarked = this._isMarked.bind(this);
        this._keyUpHandler = this._keyUpHandler.bind(this);
        this._arrowKeysHandler = this._arrowKeysHandler.bind(this);
        this._focusHandler = this._focusHandler.bind(this);
        this._clearMarkedKey = this._clearMarkedKey.bind(this);
        this.state = {
            items: props.items ? props.items : new RecordSet({ rawData: [] }),
            groups: props.items
                ? this._sortGroup(this.props, props.items)
                : { null: { items: [] } },
            selectedKey: props.selectedKey,
            markedKey: props.selectedKey,
        };
    }

    componentDidMount(): void {
        if (this.props.source) {
            this._initItems(this.props).then((items: RecordSet) => {
                this.setState({
                    items,
                    groups: this._sortGroup(this.props, items),
                });
            });
        }
    }

    componentDidUpdate(prevProps: IRadioGroupProps, prevState: IRadioGroupState): void {
        if (this.props.items && this.props.items !== prevProps.items) {
            this.setState({
                items: this.props.items,
                groups: this._sortGroup(this.props, this.props.items),
            });
        }

        if (this.props.source && this.props.source !== prevProps.source) {
            this._initItems(this.props).then((items: RecordSet) => {
                this.setState({
                    items,
                    groups: this._sortGroup(this.props, items),
                });
            });
        }
        if (
            typeof this.props.selectedKey !== 'undefined' &&
            this.props.selectedKey !== prevState.selectedKey
        ) {
            this.setState({ selectedKey: this.props.selectedKey });
        }
    }

    protected _getReadOnly(): boolean {
        return this.props.readOnly ?? this.context?.readOnly;
    }

    protected _keyUpHandler(e: SyntheticEvent<KeyboardEvent>): void {
        if (
            e.nativeEvent.keyCode === constants.key.space &&
            !this.props.itemTemplate &&
            !this._getReadOnly()
        ) {
            e.preventDefault();
            const newActiveItem = this.state.items.getRecordById(this.state.markedKey);
            if (newActiveItem && this._getHighlightedOnFocus()) {
                this._selectKeyChanged(e, newActiveItem, this.props.keyProperty);
            }
        }
    }

    protected _arrowKeysHandler(e: SyntheticEvent<KeyboardEvent>): void {
        const leftOrUp =
            e.nativeEvent.keyCode === constants.key.left ||
            e.nativeEvent.keyCode === constants.key.up;
        const rightOrDown =
            e.nativeEvent.keyCode === constants.key.right ||
            e.nativeEvent.keyCode === constants.key.down;
        if (this._getReadOnly() || this.props.itemTemplate) return;
        const keyProperty = this.props.keyProperty;

        let newActiveItem;
        if (leftOrUp) {
            e.preventDefault();
            newActiveItem = this._getNextMarkedItem(true);
        } else if (rightOrDown) {
            e.preventDefault();
            newActiveItem = this._getNextMarkedItem();
        }
        if (newActiveItem) {
            this._markedKeyChanged(newActiveItem, keyProperty);
        }
    }

    // Нужно сбрасывать markedKey, чтобы избежать моргание при повторном заходе в контрол.
    protected _clearMarkedKey() {
        this.setState({ markedKey: '' });
    }

    protected _focusHandler(e: SyntheticEvent): void {
        if (e.target === e.currentTarget) {
            const selectedItem = this.state.items.getRecordById(this.state.selectedKey);
            const keyProperty = this.props.keyProperty;
            this._markedKeyChanged(selectedItem, keyProperty);
        }
    }

    private _getNextMarkedItem(isForwardMove: boolean = false): Model {
        let firstItem = null;
        let isNextActiveItem: boolean = false;
        let nextActiveItem: Model = null;
        let isPreviousActiveItem: boolean = true;
        let previousActiveItem: Model = null;
        let returnLastItem: boolean = false;
        const thisActiveItem = this.state.items.getRecordById(this.state.markedKey);
        this.state.items.forEach((item) => {
            if (returnLastItem && !item.get('readOnly')) {
                previousActiveItem = item;
                return;
            }
            if (!firstItem && !item.get('readOnly')) {
                firstItem = item;
            }
            if (item === thisActiveItem && isForwardMove && previousActiveItem) {
                isPreviousActiveItem = false;
                return;
            } else if (item === thisActiveItem && isForwardMove) {
                returnLastItem = true;
            } else if (item === thisActiveItem) {
                isNextActiveItem = true;
            } else if (isNextActiveItem && !item.get('readOnly')) {
                nextActiveItem = item;
                isNextActiveItem = false;
            }
            if (isPreviousActiveItem && !item.get('readOnly')) {
                previousActiveItem = item;
            }
        });
        if (!nextActiveItem) {
            nextActiveItem = firstItem;
        }
        return isForwardMove ? previousActiveItem : nextActiveItem;
    }

    protected _initItems(props: IRadioGroupProps): Promise<RecordSet> {
        this._crudWrapper = new CrudWrapper({
            source: props.source,
        });
        return this._crudWrapper.query({}).then((items) => {
            return items;
        });
    }

    protected _sortGroup(options: IRadioGroupProps, items: RecordSet): IGroups {
        const result = {};
        items.each((item) => {
            let parent = options.parentProperty ? item.get(options.parentProperty) : null;
            if (typeof parent === 'undefined') {
                parent = null;
            }
            if (!result[parent]) {
                result[parent] = [];
                result[parent] = {
                    selectedKey: null,
                    items: [],
                };
            }
            result[parent].items.push(item);
        });
        return result;
    }

    protected _isSelected(item: Record): boolean {
        if (item.get(this.props.keyProperty) === this.state.selectedKey) {
            return true;
        }
        const parent = this.props.parentProperty
            ? this.state.items
                  .getRecordById(this.state.selectedKey)
                  ?.get?.(this.props.parentProperty) || null
            : null;
        if (parent) {
            const parentKey = this.state.items.getRecordById(parent)?.get?.(this.props.keyProperty);
            return parentKey === item.get(this.props.keyProperty);
        }
        return false;
    }

    protected _isMarked(item: Record): boolean {
        return (
            this._getHighlightedOnFocus() &&
            item.get(this.props.keyProperty) === this.state.markedKey
        );
    }

    protected _selectKeyChanged(
        e: SyntheticEvent<MouseEvent | TouchEvent | KeyboardEvent>,
        item: Model,
        keyProperty: string
    ): void {
        if (!this._getReadOnly() && item.get('readOnly') !== true) {
            let selectedKey = item.get(keyProperty);
            if (this.state.groups[selectedKey]) {
                if (this.state.groups[selectedKey].selectedKey !== null) {
                    selectedKey = this.state.groups[selectedKey].selectedKey;
                } else {
                    selectedKey =
                        this.state.groups[selectedKey].items[0].get(keyProperty) || selectedKey;
                }
            }
            this.setState({
                selectedKey:
                    typeof this.props.selectedKey === 'undefined'
                        ? selectedKey
                        : this.props.selectedKey,
                markedKey: item.get(keyProperty),
            });
            if (this.props.onSelectedkeychanged) {
                this.props.onSelectedkeychanged(e, selectedKey);
            }
            this.props.onSelectedKeyChanged?.(e, selectedKey);
            const parent = this.props.parentProperty ? item.get(this.props.parentProperty) : null;
            if (parent) {
                this.state.groups[parent].selectedKey = selectedKey;
            }
        }
    }

    protected _markedKeyChanged(item: Model, keyProperty: string): void {
        if (
            !this._getReadOnly() &&
            item &&
            keyProperty &&
            item.get('readOnly') !== true &&
            this._getHighlightedOnFocus()
        ) {
            this.setState({ markedKey: item.get(keyProperty) });
        }
    }

    protected _getHighlightedOnFocus(): boolean {
        return this.context?.workByKeyboard && !this._getReadOnly();
    }

    render() {
        const attrs = wasabyAttrsToReactDom(this.props.attrs || {});
        const attrsClassName =
            `controls_toggle_theme-${this.props.theme || this.context.theme}` +
            ` controls-GroupRadio controls-GroupRadio${
                this._getReadOnly() ? '_disabled' : '_enabled'
            }` +
            ` ${this._getHighlightedOnFocus() ? 'controls-RadioGroup_focused' : ''}` +
            ' ' +
            (this.props.className || attrs.className || '');
        return (
            <div
                ref={this.props.forwardedRef}
                {...attrs}
                className={attrsClassName}
                tabIndex={this.props.tabIndex || 0}
                onKeyPress={this._keyUpHandler}
                onKeyDown={this._arrowKeysHandler}
                onBlur={this.props.onBlur}
                onFocus={this._focusHandler}
                onMouseDown={this._clearMarkedKey}
                onTouchStart={this._clearMarkedKey}
            >
                <GroupTemplate
                    groupTemplate={GroupTemplate}
                    defaultItemTemplate={ItemTemplate}
                    _selectKeyChanged={this._selectKeyChanged}
                    _selectedKey={this.state.selectedKey}
                    groups={this.state.groups}
                    parent={null}
                    isSelected={this._isSelected}
                    isMarked={this._isMarked}
                    readOnly={this._getReadOnly()}
                    itemTemplateProperty={this.props.itemTemplateProperty}
                    itemTemplate={this.props.itemTemplate}
                    keyProperty={this.props.keyProperty}
                    direction={this.props.direction}
                    multiline={this.props.multiline}
                    itemClassName={this.props.itemClassName}
                    displayProperty={this.props.displayProperty}
                    captionPosition={this.props.captionPosition}
                    radioCircleVisible={this.props.radioCircleVisible}
                    validationStatus={this.props.validationStatus}
                    nodeProperty={this.props.nodeProperty}
                />
            </div>
        );
    }

    static contextType = getWasabyContext();

    static defaultProps: Partial<IRadioGroupProps> = {
        direction: 'vertical',
        validationStatus: 'valid',
        captionPosition: 'end',
        radioCircleVisible: true,
        keyProperty: 'id',
        multiline: true,
    };

    static getOptionTypes(): object {
        return {
            captionPosition: EntityDescriptor(String).oneOf(['start', 'end']),
            radioCircleVisible: EntityDescriptor(Boolean),
        };
    }
}

export { ItemTemplate, switchCircleTemplate };

/**
 * @name Controls/RadioGroup:Control#items
 * @cfg {RecordSet} Определяет набор записей по которым строится контрол.
 * @demo Controls-demo/toggle/RadioGroup/Base/Index
 */

/**
 * @name Controls/RadioGroup:Control#direction
 * @cfg {String}
 * @demo Controls-demo/toggle/RadioGroup/Direction/Index
 */

/**
 * @name Controls/RadioGroup:Control#parentProperty
 * @cfg {String}
 * @demo Controls-demo/toggle/RadioGroup/ParentProperty/Index
 */

/**
 * @name Controls/RadioGroup:Control#radioCircleVisible
 * @cfg {Boolean} Определяет, видимость иконки радиокруга.
 * @default true
 * @demo Controls-demo/toggle/RadioGroup/RadioCircleVisible/Index
 */

/**
 * @name Controls/RadioGroup:Control#captionPosition
 * @cfg {String} Определяет, с какой стороны расположен заголовок кнопки.
 * @variant start Заголовок расположен перед кнопкой.
 * @variant end Заголовок расположен после кнопки.
 * @default end
 * @demo Controls-demo/toggle/RadioGroup/CaptionPosition/Index
 */

/**
 * @name Controls/RadioGroup:Control#multiline
 * @cfg {boolean} Поведение элементов, если они не умещается.
 * @variant false Элементы не переносятся на новую строку.
 * @variant true Элементы переносятся на новую строку.
 * @default true
 * @demo Controls-demo/toggle/RadioGroup/Multiline/Index
 */

/**
 * @name Controls/RadioGroup:Control#itemClassName
 * @cfg {string} Имя класса, которое навесится на элементы компонента
 */

/**
 * @name Controls/RadioGroup:Control#displayProperty
 * @cfg {String} Имя поля элемента, значение которого будет отображаться в названии кнопок тумблера.
 *
 * @example
 * Пример описания.
 * <pre>
 *    <Controls.RadioGroup:Control displayProperty="caption" items="{{_items1}}" bind:selectedKey="_selectedKey1"/>
 * </pre>
 *
 * <pre>
 *   new RecordSet ({
 *       keyProperty: 'key',
 *       rawData: [
 *           {
 *               key: 1,
 *               title: 'title 1',
 *               caption: 'caption 1'
 *           },
 *           {
 *               key: 2,
 *               title: 'title 2',
 *               caption: 'caption 2'
 *           },
 *           {
 *               key: 3,
 *               title: 'title 3',
 *               caption: 'caption 3'
 *           }
 *       ]
 *   });
 * </pre>
 *
 * @demo Controls-demo/toggle/RadioGroup/displayProperty/Index
 */
