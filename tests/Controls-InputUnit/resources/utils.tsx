import { getLoadConfig, loadResults } from './_dataContextMock';
import { ContextOptionsProvider } from 'Controls/context';

function getContent(Children) {
    return <ContextOptionsProvider
        configs={getLoadConfig()}
        loadResults={loadResults}>
        <Children/>
    </ContextOptionsProvider>;
}

export {
    getContent
};