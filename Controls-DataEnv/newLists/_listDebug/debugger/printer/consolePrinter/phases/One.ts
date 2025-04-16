import { _phase } from './_phase';
import { IOutput } from 'Controls-DataEnv/newLists/_listDebug/debugger/output/IOutput';
import { IUpdateSessionMeta } from 'Controls-DataEnv/newLists/_listDebug/debugger/Session';
import { TDebugMode } from 'Controls-DataEnv/newLists/_listDebug/debugger/types/TDebugMode';

// Обработаем действия по платформенной логике.
// Это легко считаемое состояние, без вызова долгих операций и загрузок.
export const printPhaseOne = (output: IOutput, meta: IUpdateSessionMeta, debugMode: TDebugMode) => {
    _phase(output, meta, debugMode, 0, 'Handle actions');
};
