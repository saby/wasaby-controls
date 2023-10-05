import * as React from 'react';

import 'Controls/gridReact';
import { TGetRowPropsCallback, IResultConfig, useListData } from 'Controls/gridReact';
import { ItemsView as GridItemsView } from 'Controls/grid';
import { Container as ScrollContainer } from 'Controls/scroll';
import { Number as NumberDecorator } from 'Controls/baseDecorator';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';

import { getItems, getColumns } from './resources/CountriesData';

interface IDemoProps {
    stickyResults?: boolean;
    getRowProps?: TGetRowPropsCallback;
}

function ResultCell(props: { property: string }) {
    const results = useListData(['results']).metaData.results as Model;
    const value = results.get(props.property);
    return (
        <NumberDecorator
            value={value}
            useGrouping
            fontSize={'m'}
            fontWeight={'bold'}
            fontColorStyle={'secondary'}
        />
    );
}

function getDefaultResults(): IResultConfig[] {
    return [
        {
            key: 'count',
            render: <ResultCell property={'count'} />,
        },
        {
            key: 'populationCountries',
            render: <ResultCell property={'populationCountries'} />,
        },
        {
            key: 'populationCapitals',
            render: <ResultCell property={'populationCapitals'} />,
        },
    ];
}

function getResultsWithColspan(): IResultConfig[] {
    return [
        {
            key: 'count',
            render: (
                <div>
                    Общее кол-во записей:
                    <ResultCell property={'count'} />
                </div>
            ),
            startColumn: 1,
            endColumn: 4,
        },
    ];
}

const ITEMS_COUNT = 10;

function ResultsDemo(props: IDemoProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const [items, setItems] = React.useState(getItems(ITEMS_COUNT));
    const [columns, setColumns] = React.useState(getColumns());
    const [results, setResults] = React.useState<IResultConfig[]>(getDefaultResults());

    const changeResultsField = (items: RecordSet) => {
        const results = items.getMetaData().results;
        results.set('count', results.get('count') + 1);
    };

    const changeMetaData = () => {
        const metaData = items.getMetaData();
        const newMetaData = {
            ...metaData,
            results: metaData.results.clone(),
        };
        newMetaData.results.set('count', newMetaData.results.get('count') + 1);
        items.setMetaData(newMetaData);
    };

    const setResultsWithColspan = () => {
        setResults(getResultsWithColspan);
    };

    const regenerateColumns = () => {
        setColumns(getColumns());
    };

    const regenerateResults = () => {
        setResults(getDefaultResults());
    };

    const regenerateItemsWithNewMetaData = () => {
        const newItems = getItems(ITEMS_COUNT);
        changeResultsField(newItems);
        setItems(newItems);
    };

    return (
        <div ref={ref}>
            <button onClick={() => changeResultsField(items)}>Change results field</button>
            <button onClick={changeMetaData}>Change full metadata</button>
            <button onClick={setResultsWithColspan}>Results with colspan</button>
            <button onClick={regenerateColumns}>Regenerate columns</button>
            <button onClick={regenerateResults}>Regenerate results</button>
            <button onClick={regenerateItemsWithNewMetaData}>Regenerate items with new meta data</button>
            <ScrollContainer className={'controlsDemo__height500 controlsDemo__width800px'}>
                <GridItemsView
                    items={items}
                    columns={columns}
                    results={results}
                    resultsPosition="top"
                    stickyResults={props.stickyResults}
                    getRowProps={props.getRowProps}
                />
            </ScrollContainer>
        </div>
    );
}

export default React.forwardRef(ResultsDemo);
