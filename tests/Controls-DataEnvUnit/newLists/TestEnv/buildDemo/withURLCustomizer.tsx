import { IListDataFactoryArguments } from 'Controls-DataEnv/list';
import * as React from 'react';
import { Serializer } from 'Types/serializer';
import { constants } from 'Env/Env';
import { location } from 'Application/Env';

export function withURLCustomizer<
    TOuter extends {
        dataFactoryArguments?: Partial<IListDataFactoryArguments>;
    },
>(
    Component: React.ComponentType<TOuter>,
    dataFactoryArgumentsFromDemo: IListDataFactoryArguments
): React.ComponentType<TOuter> {
    if (
        typeof window === 'undefined' ||
        !constants ||
        !constants.isBrowserPlatform ||
        constants.isServerSide
    ) {
        return Component;
    }

    const Composed = React.forwardRef((props: TOuter, ref: React.ForwardedRef<HTMLDivElement>) => {
        const dataFactoryArguments: IListDataFactoryArguments = {
            ...props.dataFactoryArguments,
            ...decodeDataFactoryArguments(new URL(location.href).search),
        };

        const meta = {
            demoArgs: dataFactoryArgumentsFromDemo,
            urlArgs: dataFactoryArguments,
            allArgs: {
                ...dataFactoryArgumentsFromDemo,
                ...dataFactoryArguments,
            },
            demoURL: encodeDataFactoryArguments(dataFactoryArgumentsFromDemo),
            urlURL: encodeDataFactoryArguments(dataFactoryArguments),
            allURL: encodeDataFactoryArguments({
                ...dataFactoryArgumentsFromDemo,
                ...dataFactoryArguments,
            }),
            encoder: encodeDataFactoryArguments,
        };
        // logger.info('Мета информация', meta);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.meta = window.meta || meta;

        return <Component {...props} dataFactoryArguments={dataFactoryArguments} ref={ref} />;
    });

    Composed.displayName = Component.displayName || Component.name;

    return Composed as unknown as React.ComponentType<TOuter>;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export function encodeDataFactoryArguments(
    dataFactoryArguments: Partial<IListDataFactoryArguments>
): string {
    const url = new URL('http://localhost:777/');
    url.searchParams.set(
        'dataFactoryArguments',
        JSON.stringify(dataFactoryArguments, new Serializer().serialize)
    );
    return url.search;
}

export function decodeDataFactoryArguments<TDataFactoryArguments extends IListDataFactoryArguments>(
    search: string
): Partial<TDataFactoryArguments> {
    const param = new URLSearchParams(search).get('dataFactoryArguments');
    if (!param) {
        return {};
    }
    return JSON.parse(param, new Serializer().deserialize) || {};
}
