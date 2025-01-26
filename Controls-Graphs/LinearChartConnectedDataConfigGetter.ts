import { IRouter } from 'Router/router';

interface IDataContext {
    get(name: unknown): () => object[];
}

export default function sourceConfigGetter(
    props: Record<string, unknown>,
    filter: Record<string, unknown>,
    Router: IRouter,
    dataContext: IDataContext
): object {
    const items = dataContext.get(props.name);
    return {
        [props.name]: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                items,
                source: props.source,
            },
        },
    };
}
