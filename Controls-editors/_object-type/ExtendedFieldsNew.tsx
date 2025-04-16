import { Button } from 'Controls/buttons';
import 'css!Controls-editors/object-type';
import TypeHierarchyPadding from './TypeHierarchyPadding';
import { useCallback, useContext, createContext, useMemo } from 'react';
import { ObjectTypeEditorRootContext } from './Contexts';
import { Button as DropdownButton } from 'Controls/dropdown';
import { RecordSet } from 'Types/collection';
import { findGroupById, IExtendedAttribute, IExtendedGroup } from './utils/getExtendedItems';
import { Model } from 'Types/entity';
import * as rk from 'i18n!Controls-editors';

export interface IExtendedFieldsContext {
    fields: IExtendedGroup[];
}

/**
 * Контекст доступа к списку полей, которые скрыты по чипсам
 */
export const ExtendedFieldsContext = createContext<IExtendedFieldsContext>({
    fields: [],
});

export interface IExtendedFieldsProps {
    groupId?: string;
    showGroups?: boolean;
}

interface IItemForChips {
    type: 'field' | 'group';
    data: IExtendedGroup | IExtendedAttribute;
}

/**
 * Количество чипсы, больше которого нужно показывать кнопку Еще.
 * @private
 */
const ITEMS_THRESHOLD_SHOW_MORE_BUTTON = 5;

/**
 * Количество чипсы, больше которого нужно показывать только иконки.
 * @private
 */
const ITEMS_THRESHOLD_SHOW_ONLY_ICON = 3;

export const ExtendedFieldsNew = function ExtendedFields(props: IExtendedFieldsProps) {
    const { groupId, showGroups } = props;
    const { fields } = useContext(ExtendedFieldsContext);
    const editorRootContext = useContext(ObjectTypeEditorRootContext);

    if (!editorRootContext) {
        throw new Error('Не найден контекст ObjectTypeEditorRootContext');
    }

    const group = useMemo(() => {
        if (showGroups) {
            return undefined;
        }
        return findGroupById(fields, groupId);
    }, [fields, groupId, showGroups]);

    const { showProperty } = editorRootContext;

    // Собираем все элементы для отображения в одном массиве
    const itemsToRender = useMemo<IItemForChips[]>(() => {
        const items: IItemForChips[] = [];

        // Добавляем невидимые поля
        if (group && !showGroups) {
            group.attributes
                .filter((x) => !x.visible)
                .forEach((field) => {
                    items.push({
                        type: 'field',
                        data: field,
                    });
                });
        }

        // Добавляем невидимые группы
        const groupsToProcess = showGroups ? fields : group?.groups || [];
        groupsToProcess
            .filter((x) => !x.visible)
            .forEach((group) => {
                items.push({
                    type: 'group',
                    data: group,
                });
            });

        return items;
    }, [fields, group, showGroups]);

    // Определяем режим отображения на основе общего количества элементов
    const mode = itemsToRender.length <= ITEMS_THRESHOLD_SHOW_ONLY_ICON ? 'icon_text' : 'icon';

    if (itemsToRender.length === 0) {
        return null;
    }

    const top5Items =
        itemsToRender.length > ITEMS_THRESHOLD_SHOW_MORE_BUTTON
            ? itemsToRender.slice(0, ITEMS_THRESHOLD_SHOW_MORE_BUTTON - 1)
            : itemsToRender;
    const itemsForMore =
        itemsToRender.length > ITEMS_THRESHOLD_SHOW_MORE_BUTTON
            ? itemsToRender.slice(ITEMS_THRESHOLD_SHOW_MORE_BUTTON - 1)
            : [];

    return (
        <div
            className={
                'controls-ObjectType__extended_fields' +
                (showGroups ? ' controls-ObjectType__extended_fields__global' : '')
            }
            data-qa="controls-PropertyGrid__extended_fields"
        >
            <TypeHierarchyPadding />
            <div className="controls-ObjectType__extended_fields-wrapper">
                {top5Items.map((item) => {
                    if (item.type === 'field') {
                        const field = item.data as IExtendedAttribute;
                        return (
                            <ChipsRender
                                id={field.name}
                                icon={field.icon}
                                title={field.title}
                                mode={mode}
                                onClick={showProperty}
                                key={`field_${field.name}`}
                            />
                        );
                    } else {
                        const group = item.data as IExtendedGroup;
                        return (
                            <GroupChipsRender
                                group={group}
                                key={`group_${group.id}`}
                                onClick={showProperty}
                            />
                        );
                    }
                })}
                {itemsForMore.length > 0 && (
                    <MoreChips onClick={showProperty} items={itemsForMore} />
                )}
            </div>
        </div>
    );
};

ExtendedFieldsNew.displayName = 'Controls-editors/object-type:ExtendedFields';

interface IMoreChipsProps {
    onClick(id: string): void;
    items: IItemForChips[];
}

function MoreChips(props: IMoreChipsProps) {
    const { items, onClick } = props;

    const itemsRecordSet = useMemo<RecordSet>(() => {
        return new RecordSet({
            keyProperty: 'key',
            rawData: items
                .filter((x) => !x.data.visible)
                .map((x) => {
                    if (x.type === 'field') {
                        const attributeItem = x.data as IExtendedAttribute;
                        return {
                            key: attributeItem.name,
                            title: attributeItem.title,
                            icon: attributeItem.icon,
                        };
                    } else if (x.type === 'group') {
                        const groupItem = x.data as IExtendedGroup;
                        return {
                            key: groupItem.name,
                            title: groupItem.name,
                        };
                    }
                }),
        });
    }, [items]);

    const itemClickHandler = useCallback(
        (model: Model) => {
            onClick(model.get('key'));
        },
        [onClick]
    );

    return (
        <DropdownButton
            keyProperty={'key'}
            viewMode="filled"
            menuHeadingCaption={rk('Добавить')}
            items={itemsRecordSet}
            onMenuItemActivate={itemClickHandler}
            data-qa={'controls-ObjectType__extended_group_more'}
            buttonStyle="pale"
            icon={'icon-SwipeMenu'}
        />
    );
}

interface IGroupChipsRenderProps {
    group: IExtendedGroup;
    onClick(id: string): void;
}
function GroupChipsRender(props: IGroupChipsRenderProps) {
    const { group, onClick } = props;

    const { attributes } = group;

    const items = useMemo<RecordSet>(() => {
        return new RecordSet({
            keyProperty: 'key',
            rawData: attributes
                .filter((x) => !x.visible)
                .map((x) => {
                    return {
                        key: x.name,
                        title: x.title,
                        icon: x.icon,
                    };
                }),
        });
    }, [attributes]);

    const itemClickHandler = useCallback(
        (model: Model) => {
            onClick(model.get('key'));
        },
        [onClick]
    );

    return (
        <DropdownButton
            keyProperty={'key'}
            viewMode="filled"
            items={items}
            caption={group.name}
            tooltip={group.name}
            onMenuItemActivate={itemClickHandler}
            data-qa={`controls-ObjectType__extended_group_${group.name}`}
            buttonStyle="pale"
        />
    );
}

interface IChipsRenderProps {
    title: string | undefined;
    icon: string | undefined;
    id: string;
    mode: 'icon_text' | 'icon';
    onClick(id: string): void;
}

function ChipsRender(props: IChipsRenderProps) {
    const { id, onClick, mode } = props;

    const clickHandler = useCallback(() => {
        onClick(id);
    }, [id, onClick]);

    return (
        <Button
            viewMode="filled"
            icon={props.icon}
            caption={mode === 'icon_text' || !props.icon ? props.title : undefined}
            tooltip={props.title}
            onClick={clickHandler}
            data-qa={`controls-ObjectType__extended_field__${props.id}`}
            buttonStyle="pale"
        />
    );
}
