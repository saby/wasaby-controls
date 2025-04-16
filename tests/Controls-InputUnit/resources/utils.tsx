import { getLoadConfig, loadResults } from './_dataContextMock';
import { Provider } from 'Controls-DataEnv/context';

function getContent(Children) {
    return <Provider
        configs={getLoadConfig()}
        loadResults={loadResults}>
        <Children/>
    </Provider>;
}

export {
    getContent
};