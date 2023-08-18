import * as React from 'react';
import LayoutStack from 'Layout/Selector/Stack';
import LayoutBrowser from 'Layout/Selector/Browser';
import { Memory } from 'Types/source';
import { Input } from 'Controls/search';
import { Container as ScrollContainer } from 'Controls/scroll';
import { View } from 'Controls/list';
import { useState, memo, useMemo } from 'react';
import { Record } from 'Types/entity';
import { EmptyView, HelpPerson } from 'Hint/Template';
import rk = require('i18n!Controls');

interface IColumnsStack {
    selectedKeys: string;
    tableColumns: object[];
}

const KEY_PROPERTY = 'Id';
const DISPLAY_PROPERTY = 'DisplayName';

const ColumnsStack = memo((props: IColumnsStack) => {
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

    function getEmptyTemplate(): JSX.Element {
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

    function getBodyContentTemplate(): JSX.Element {
        return (
            <LayoutBrowser
                keyProperty={KEY_PROPERTY}
                displayProperty={DISPLAY_PROPERTY}
                searchParam={DISPLAY_PROPERTY}
                source={source}
                selectedKeys={selectedKeys}
                multiSelectVisibility="visible"
                search={getSearchControl()}
            >
                <ScrollContainer>
                    {source && (
                        <View
                            source={source}
                            filter={filter}
                            keyProperty={KEY_PROPERTY}
                            displayProperty={DISPLAY_PROPERTY}
                            onSelectedKeysChanged={onSelectedKeysChanged}
                            onFilterChanged={onFilterChanged}
                            emptyTemplate={getEmptyTemplate}
                            multiSelectVisibility="visible"
                            markerVisibility="hidden"
                        ></View>
                    )}
                </ScrollContainer>
            </LayoutBrowser>
        );
    }

    function getSearchControl(): JSX.Element {
        return <Input placeholder="Найти"></Input>;
    }

    return (
        <LayoutStack
            headingCaption={rk('Выбор колонок')}
            multiSelect={true}
            multiSelectVisibility={true}
            bodyContentTemplate={getBodyContentTemplate()}
        ></LayoutStack>
    );
});

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

        return !excluded.icnludes(id);
    }

    return marked.includes(id);
}
