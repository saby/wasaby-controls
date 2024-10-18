import * as React from 'react';

import 'Controls/gridReact';
import 'Controls/gridColumnScroll';
import {
    IColumnConfig,
    IEmptyViewConfig,
    TGetRowPropsCallback,
    useItemData,
} from 'Controls/gridReact';
import { ItemsView as GridItemsView } from 'Controls/grid';

import { addOneToDataArray, getColumns, getItems } from './Data';
import { useCallback } from 'react';
import { IEditingConfig } from 'Controls/display';
import { Text as TextInput } from 'Controls/input';
import { Model } from 'Types/entity';

interface IDemoProps {
    stickyResults?: boolean;
    getRowProps?: TGetRowPropsCallback;
}

export function CellRender(props): JSX.Element {
    const { property } = props;
    const { renderValues } = useItemData<Model>([property]);
    return <div>{renderValues[property]}</div>;
}

function getEmptyView(callback: () => void): IEmptyViewConfig[] {
    return [
        {
            key: 'first_cell',
            render: (
                <TextInput
                    placeholder={'Введите наименование, штрих-код или артикул'}
                    contrastBackground={true}
                    onClick={() => callback()}
                />
            ),
            startColumn: 1,
            endColumn: 2,
            getCellProps: () => ({
                backgroundStyle: 'unaccented',
            }),
        },
        {
            key: 'second_cell',
            render: (
                <div>
                    или выберите из{' '}
                    <a href="#" className="controls-text-link">
                        каталога
                    </a>
                </div>
            ),
            startColumn: 2,
            endColumn: 6,
            getCellProps: () => ({
                backgroundStyle: 'unaccented',
                halign: 'start',
            }),
        },
    ];
}

function ResultsDemo(props: IDemoProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const [items, setItems] = React.useState(getItems());

    const columns = React.useMemo<IColumnConfig[]>(() => {
        return getColumns().map((el) => {
            el.render = <CellRender property={el.key} />;
            return el;
        });
    }, []);

    const changeEdit = useCallback(() => {
        addOneToDataArray();
        setItems(getItems());
    }, [items, setItems]);

    const emptyView = React.useMemo(() => getEmptyView(changeEdit), []);

    const editingConfig = React.useMemo<IEditingConfig>(() => {
        return {
            editOnClick: true,
            mode: 'row',
            inputBackgroundVisibility: 'visible',
            toolbarVisibility: true,
        };
    }, []);

    return (
        <div ref={ref} style={{ padding: '12px' }}>
            <GridItemsView
                items={items}
                columns={columns}
                emptyView={emptyView}
                editingConfig={editingConfig}
            />
        </div>
    );
}

export default React.forwardRef(ResultsDemo);
