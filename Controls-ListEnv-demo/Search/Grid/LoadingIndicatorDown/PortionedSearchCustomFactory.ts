import { List, ListSlice } from 'Controls/dataFactory';
import { AsyncOperationsOrchestrator } from 'Controls-DataEnv/abstractList';

class DisabledIdleDetector extends AsyncOperationsOrchestrator {
    registerPendingPromise<T>(_: string, promise: Promise<T>): Promise<T> {
        return promise;
    }
}

// Слайс с отключенной регистрацией промисов.
// Необходим для возможности приостановки исполенения промисов, что позволяет применять изменения к интрефейсу итеративно.
// Актуально только для тестовых целей
class ExtendedSlice extends ListSlice {
    _asyncOperationsOrchestrator: AsyncOperationsOrchestrator = new DisabledIdleDetector();
}

const slice = ExtendedSlice;
const loadData = List.loadData;

export { loadData, slice };
