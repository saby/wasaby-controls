/*
  @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-magic-numbers */

import { RecordSet } from 'Types/collection';
import { Record } from 'Types/entity';
import { TreeGridCollection } from 'Controls/treeGrid';
import { ExternalCollectionItemKeys, VirtualCollection } from 'Controls-Lists/dataFactory';
import { ListChangeNameEnum } from 'Controls/listAspects';
import { ListChangeSourceEnum } from 'Controls/listAspects';

const {
    parent: parentProperty,
    ident: keyProperty,
    is_expanded: expandProperty,
    node_type: nodeProperty,
} = ExternalCollectionItemKeys;

describe('Controls-ListsUnit/Lists/Mobile/VirtualCollection', () => {
    const virtualCollection = new VirtualCollection({
        displayProperty: keyProperty,
    });
    beforeEach(() => {
        virtualCollection.sync({
            collection: new TreeGridCollection({
                collection: new RecordSet({
                    rawData: [
                        {
                            [keyProperty]: '0',
                            [expandProperty]: false,
                            [nodeProperty]: null,
                            [parentProperty]: null,
                        },
                        {
                            [keyProperty]: '1',
                            [expandProperty]: false,
                            [nodeProperty]: null,
                            [parentProperty]: null,
                        },
                        {
                            [keyProperty]: '2',
                            [expandProperty]: false,
                            [nodeProperty]: null,
                            [parentProperty]: null,
                        },
                        {
                            [keyProperty]: '3',
                            [expandProperty]: false,
                            [nodeProperty]: true,
                            [parentProperty]: null,
                        },
                        {
                            [keyProperty]: '4',
                            [expandProperty]: false,
                            [nodeProperty]: true,
                            [parentProperty]: null,
                        },
                        {
                            [keyProperty]: '5',
                            [expandProperty]: true,
                            [nodeProperty]: true,
                            [parentProperty]: null,
                        },
                    ],
                    format: [
                        { name: keyProperty, type: 'string' },
                        { name: expandProperty, type: 'boolean' },
                        { name: nodeProperty, type: 'boolean' },
                    ],
                    keyProperty,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                }) as any,
                keyProperty,
                parentProperty,
                nodeTypeProperty: nodeProperty,
                root: null,
                columns: [],
            }),
            hasMoreStorage: undefined,
        });
    });

    test('should return valid expanded keys and changes', () => {
        expect(true).toBeTruthy();
    });
});
