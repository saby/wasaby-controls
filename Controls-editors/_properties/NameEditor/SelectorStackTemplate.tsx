import { useMemo, useEffect } from 'react';
import { Model } from 'Types/entity';
import { SbisService } from 'Types/source';
import { FIELD_LIST_ENDPOINT, FieldListColumns } from 'Frame-DataEnv/dataFactory';
import { default as Stack } from 'Layout/Selector/Stack';
import { default as Browser } from 'Layout/Selector/Browser';
import { View as TreeGridView } from 'Controls/treeGrid';
import * as rk from 'i18n!Controls-editors';
import { appendFilter, createFieldListSource, capitalizeTypeNames } from './Selector';

interface ISelectorStackTemplateProps {
    objectName: string;
    types: string[];
}

function SelectorStackTemplate(props: ISelectorStackTemplateProps) {
    const { keyProperty, parentProperty, displayProperty, nodeProperty, contract, method } =
        FIELD_LIST_ENDPOINT;

    const source = useMemo<SbisService>(() => {
        return createFieldListSource(keyProperty, contract, method);
    }, [keyProperty, contract, method]);

    useEffect(() => {
        const handler = (eventObject: Event, name: string, args: Record<string, unknown>) => {
            if (name === method) {
                const filter = args.Фильтр as Model;
                appendFilter(filter, {
                    ObjectName: props.objectName,
                    Types: capitalizeTypeNames(props.types),
                    Разворот: 'C разворотом',
                });
            }
            eventObject.setResult(args);
        };
        source.subscribe('onBeforeProviderCall', handler);
        return () => {
            source.unsubscribe('onBeforeProviderCall', handler);
        };
    }, [source, method, props.types, props.objectName]);

    const COLUMNS = [
        {
            displayProperty,
            textOverflow: 'ellipsis',
            align: 'left',
            valign: 'center',
            template: FieldListColumns.TitleColumnTemplate,
        },
        {
            displayProperty,
            textOverflow: 'ellipsis',
            width: '36px',
            align: 'right',
            valign: 'center',
            template: FieldListColumns.IconColumnTemplate,
        },
    ];

    const StackBodyContent = useMemo(() => {
        return (
            <Browser
                keyProperty={keyProperty}
                parentProperty={parentProperty}
                nodeProperty={nodeProperty}
                selectionType={'leaf'}
                source={source}
            >
                <TreeGridView
                    displayProperty={displayProperty}
                    className="controls-DataObjectFieldListPage"
                    expanderIcon="hiddenNode"
                    contextMenuVisibility={false}
                    itemPadding={{
                        left: 'S',
                        right: 'S',
                    }}
                    searchNavigationMode="expand"
                    style="master"
                    columns={COLUMNS}
                />
            </Browser>
        );
    }, [COLUMNS, displayProperty, keyProperty, nodeProperty, parentProperty, source]);

    return <Stack headingCaption={rk('Поля')} bodyContentTemplate={StackBodyContent} />;
}

export { SelectorStackTemplate };
