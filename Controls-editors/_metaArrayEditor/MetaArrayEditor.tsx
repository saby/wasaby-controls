import { Fragment, useMemo, useCallback } from 'react';
import ArrayItem from './MetaArrayItem';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import { Button } from 'Controls/buttons';
import * as translate from 'i18n!Controls-editors';
import { defaultSort } from 'Controls-editors/object-type';
import 'css!Controls-editors/_metaArrayEditor/MetaArrayEditor';

interface IArrayEditorProps {
    items?: {
        id: string;
    }[];
    value?: object;
    onChange: Function;
    typesMap: object;
}

export default function MetaArrayEditor(props: IArrayEditorProps): JSX.Element {
    const { LayoutComponent = Fragment, items = [], value = {}, onChange, typesMap = {} } = props;
    const metaTypes = useMemo(() => {
        const result = {};
        items.forEach((item) => {
            const typePath = typesMap[item.id];
            result[item.id] = typePath && isLoaded(typePath) && loadSync(typePath);
        });
        return result;
    }, [items]);
    const itemsWithValue = useMemo(() => {
            const metaArray = Object.entries(metaTypes).sort(([, meta1], [, meta2]) => {
                return defaultSort(meta1, meta2);
            });
            return metaArray.map((item) => {
                return { id: item[0], value: value[item[0]] };
            })
        },
        [value]
    );
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

    return (
        <LayoutComponent>
            <div className="controls-ArrayEditor">
                {existingItems?.map((item) => {
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
                })}
                {itemsToAdd?.length ? (
                    <>
                        <div
                            className={`controls-ArrayEditor__itemsToAddTitle ${
                                itemsToAdd.length < items.length
                                    ? 'controls-ArrayEditor__itemsToAddTitle_withTopOffset'
                                    : ''
                            }`}
                        >
                            {translate('Можно добавить')}
                        </div>
                        <div className="controls-ArrayEditor__buttons ws-flexbox ws-flex-column ws-align-items-start">
                            {itemsToAdd.map((item) => {
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
                            })}
                        </div>
                    </>
                ) : null}
            </div>
        </LayoutComponent>
    );
}
