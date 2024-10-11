import { Fragment, useCallback, useMemo } from 'react';
import ArrayItem from './MetaArrayItem';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import { Button } from 'Controls/buttons';
import { Meta } from 'Meta/types';
import { Permission } from 'Permission/access';
import * as translate from 'i18n!Controls-editors';
import 'css!Controls-editors/_metaArrayEditor/MetaArrayEditor';

const ALL_ZONES_MODE = 11;
const ALL_ZONES_WITHOUT_NESTED_ZONES_MODE = 10;

function checkRights(access: { rights?: string[]; mode?: number }): boolean {
    let hasRights = true;
    const rights = Permission.get(access?.rights || []);

    if (rights.length) {
        if (access.mode === ALL_ZONES_MODE || access.mode === ALL_ZONES_WITHOUT_NESTED_ZONES_MODE) {
            hasRights = rights.every((right) => {
                return right.isRead();
            });
        } else {
            hasRights = rights.some((right) => {
                return right.isRead();
            });
        }
    }

    return hasRights;
}

interface IArrayEditorProps {
    items?: {
        id: string;
    }[];
    value?: object;
    onChange: Function;
    typesMap: object;
}

function sort(firstMeta: Meta<unknown>, secondMeta: Meta<unknown>): number {
    const firstOrder = Number.MAX_SAFE_INTEGER - firstMeta.getOrder();
    const secondOrder = Number.MAX_SAFE_INTEGER - secondMeta.getOrder();
    return secondOrder - firstOrder;
}

export default function MetaArrayEditor(props: IArrayEditorProps): JSX.Element {
    const { LayoutComponent = Fragment, items, value, onChange, typesMap } = props;
    const metaTypes = useMemo(() => {
        const result = {};
        items.forEach((item) => {
            const typePath = typesMap[item.id];
            result[item.id] = typePath && isLoaded(typePath) && loadSync(typePath);
            if (!checkRights(result[item.id]?.getAccess && result[item.id].getAccess())) {
                delete result[item.id];
            }
        });
        return result;
    }, [items]);
    const itemsWithValue = useMemo(() => {
        const metaArray = Object.entries(metaTypes).sort(([, meta1], [, meta2]) => {
            return sort(meta1, meta2);
        });
        return metaArray.map((item) => {
            return { id: item[0], value: value[item[0]] };
        });
    }, [value]);
    const existingItems = useMemo(
        () => itemsWithValue.filter((item) => item.id in value),
        [itemsWithValue, value]
    );
    const itemsToAdd = useMemo(
        () => itemsWithValue.filter((item) => !(item.id in value)),
        [itemsWithValue, value]
    );
    const onItemAdd = useCallback(
        (item, metaType) => {
            const newValue = {
                ...value,
                [item.id]: metaType.getDefaultValue(),
            };
            onChange(newValue);
        },
        [value, onChange]
    );
    const onItemDelete = useCallback(
        (item) => {
            const newValue = { ...value };
            delete newValue[item.id];
            onChange(newValue);
        },
        [value, onChange]
    );
    const onItemChange = useCallback(
        (item, itemValue) => {
            const newValue = {
                ...value,
                [item.id]: itemValue,
            };
            onChange(newValue);
        },
        [value, onChange]
    );

    const existingItemsJsx = useMemo(() => {
        return existingItems?.map((item) => {
            return (
                <ArrayItem
                    key={item.id}
                    className="controls-ArrayEditor__item"
                    item={item}
                    typesMap={typesMap}
                    onDelete={onItemDelete}
                    onChange={(itemValue) => onItemChange(item, itemValue)}
                />
            );
        });
    }, [existingItems, typesMap, onItemDelete, onItemChange]);

    const itemsToAddJsx = useMemo(() => {
        return itemsToAdd.map((item) => {
            return (
                <Button
                    key={item.id}
                    caption={metaTypes[item.id]?.getTitle()}
                    viewMode="ghost"
                    fontColorStyle="label"
                    inlineHeight="m"
                    className="controls-ArrayEditor__button"
                    onClick={() => onItemAdd(item, metaTypes[item.id])}
                    data-qa={`controls-PropertyGrid__editor_${item.id}`}
                />
            );
        });
    }, [itemsToAdd, metaTypes, onItemAdd]);

    return (
        <LayoutComponent>
            <div className="controls-ArrayEditor">
                {existingItemsJsx}
                {itemsToAdd?.length ? (
                    <>
                        <div
                            className={`controls-ArrayEditor__itemsToAddTitle ${
                                existingItems?.length > 0
                                    ? 'controls-ArrayEditor__itemsToAddTitle_withTopOffset'
                                    : ''
                            }`}
                        >
                            {translate('Можно добавить')}
                        </div>
                        <div className="controls-ArrayEditor__buttons ws-flexbox ws-flex-column ws-align-items-start">
                            {itemsToAddJsx}
                        </div>
                    </>
                ) : null}
            </div>
        </LayoutComponent>
    );
}

MetaArrayEditor.defaultProps = {
    items: [],
    value: {},
    typesMap: {},
};
