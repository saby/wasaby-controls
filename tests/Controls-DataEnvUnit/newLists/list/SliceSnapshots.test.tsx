/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { ListSlice } from 'Controls/dataFactory';

import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { act } from 'react-dom/test-utils';
import { render, waitFor } from '@testing-library/react';
import { WasabyEvents } from 'UICore/Events';
import { useUpdateVisualizer } from '../TestEnv/useUpdateVisualizer';
import { fetch, HTTPStatus } from 'Browser/Transport';
import * as DataSource from 'Controls/dataSource';

function sliceIsIdle(slice: ListSlice): Promise<void> {
    return waitFor(() => expect(slice.isIdle()).toBeTruthy());
}

describe('Controls/ListSliceSnapshots', () => {
    let container: HTMLDivElement;

    beforeEach(() => {
        container = document.createElement('div');
        WasabyEvents.initInstance(container);
        document.body.appendChild(container);
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        WasabyEvents.destroyInstance(container);
        container.remove();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        container = null;
    });

    describe('Загрузка записей по скролу', () => {
        it('Источник вернул ошибку загрузки', async () => {
            const hasMoreDataSpy = jest
                .spyOn(DataSource.NewSourceController.prototype, 'hasMoreData')
                .mockImplementation(() => true);
            const { Slice, Component } = useUpdateVisualizer({
                deps: ['errorViewConfig', 'loading'],
                Slice: ListSlice,
                replacer: (key, sliceState) => {
                    if (key === 'errorViewConfig' && sliceState?.errorViewConfig) {
                        return {
                            ...sliceState.errorViewConfig,
                            options: {
                                ...sliceState.errorViewConfig.options,
                                error: null,
                            },
                        };
                    }
                },
            });

            const error = new fetch.Errors.HTTP({
                httpError: HTTPStatus.GatewayTimeout,
                message: 'test',
                url: 'test',
            });
            const source = new Memory();

            source.query = jest.fn().mockRejectedValue(error);

            const slice = new Slice({
                config: {
                    source,
                },
                loadResult: {
                    items: new RecordSet(),
                },
            });

            const { asFragment } = render(<Component />, {
                container,
            });

            await act(async () => {
                return slice._loadItemsToDirection('down').catch((error) => error);
            });

            await waitFor(() => expect(slice.state.errorViewConfig?.mode).toStrictEqual('inlist'));

            await sliceIsIdle(slice);

            expect(asFragment()).toMatchSnapshot();
            hasMoreDataSpy.mockRestore();
        });
    });
});
