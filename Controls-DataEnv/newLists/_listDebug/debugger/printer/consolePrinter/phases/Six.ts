import { _phase } from './_phase';
import { IOutput } from 'Controls-DataEnv/newLists/_listDebug/debugger/output/IOutput';
import { IUpdateSessionMeta } from 'Controls-DataEnv/newLists/_listDebug/debugger/Session';
import { TDebugMode } from 'Controls-DataEnv/newLists/_listDebug/debugger/types/TDebugMode';

// От завершения обновление в коде до завершения перерисовки.
// В данной фазе происходит накатывание изменений на коллекцию.
export const printPhaseSix = (output: IOutput, meta: IUpdateSessionMeta, debugMode: TDebugMode) => {
    _phase(output, meta, debugMode, 5, 'Apply state to collection');
};
