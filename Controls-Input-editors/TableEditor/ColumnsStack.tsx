import * as React from 'react';
import LayoutStack from 'Layout/Selector/Stack';
import LayoutBrowser from 'Layout/Selector/Browser';
import { Memory } from 'Types/source';
import { Input } from 'Controls/search';
import { Container as ScrollContainer } from 'Controls/scroll';
import { View } from 'Controls/list';
import {useState, memo, useMemo, forwardRef} from 'react';
import { Record } from 'Types/entity';
import { EmptyView, HelpPerson } from 'Hint/Template';
import rk = require('i18n!Controls');

interface IColumnsStack {
    selectedKeys: string;
    tableColumns: object[];
}

const KEY_PROPERTY = 'Id';
const DISPLAY_PROPERTY = 'DisplayName';
const SEARCH_PROPERTY = DISPLAY_PROPERTY;

const customEvents = ['onSelectedKeysChanged'];

const SearchControl = memo(forwardRef((p, r) => {
    return <Input {...p} ref={r} placeholder={rk('Найти')}></Input>;
}));

const ColumnsStack = memo(forwardRef((props: IColumnsStack, ref) => {
    const [selectedKeys, setSelectedKeys] = useState(props.selectedKeys || []);
    const [filter, setFilter] = useState({});

    const source = useMemo(() => {
        return new Memory({
            data: props.tableColumns || [],
            keyProperty: KEY_PROPERTY,
            filter: (item, where) => {
                if (where.selection) {
                    return filterBySelection(item, where.selection);
                }

                if (where[SEARCH_PROPERTY]) {
                    return item.get(SEARCH_PROPERTY).toLowerCase().includes(where[SEARCH_PROPERTY].toLowerCase());
                }

                return true;
            },
        });
    }, []);

    function onSelectedKeysChanged(keys: string[]): void {
        setSelectedKeys(keys);
    }

    function onFilterChanged(value): void {
        setFilter(value);
    }

    function emptyTemplate(): JSX.Element {
        return (
            <EmptyView
                title={rk('Отсутствуют колонки')}
                imageSize="s"
                layout="row"
                imagePosition="right"
                size="s"
                image={HelpPerson.common.wowNothing}
            ></EmptyView>
        );
    }

    return (
        <LayoutStack
            headingCaption={rk('Выбор колонок')}
            multiSelect={true}
            multiSelectVisibility={true}
            bodyContentTemplate={(
                <LayoutBrowser
                    keyProperty={KEY_PROPERTY}
                    displayProperty={DISPLAY_PROPERTY}
                    searchParam={SEARCH_PROPERTY}
                    source={source}
                    selectedKeys={selectedKeys}
                    onSelectedKeysChanged={onSelectedKeysChanged}
                    multiSelectVisibility="visible"
                    customEvents={customEvents}
                    search={SearchControl}
                >
                    <ScrollContainer>
                        {source && (
                            <View
                                source={source}
                                filter={filter}
                                keyProperty={KEY_PROPERTY}
                                displayProperty={DISPLAY_PROPERTY}
                                onFilterChanged={onFilterChanged}
                                emptyTemplate={emptyTemplate}
                                multiSelectVisibility="visible"
                                markerVisibility="hidden"
                            ></View>
                        )}
                    </ScrollContainer>
                </LayoutBrowser>
            )}
        />
    );
}));

ColumnsStack.isReact = true;

export default ColumnsStack;

function filterBySelection(item: object, selection: Record): boolean {
    const marked = selection.get('marked');
    const excluded = selection.get('excluded');
    const id = item.getData()[KEY_PROPERTY].toString();

    if (marked.includes(null)) {
        if (!excluded.length) {
            return true;
        }

        return !excluded.includes(id);
    }

    return marked.includes(id);
}
