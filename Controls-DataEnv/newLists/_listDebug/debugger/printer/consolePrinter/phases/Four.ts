import { _phase } from './_phase';
import { IOutput } from 'Controls-DataEnv/newLists/_listDebug/debugger/output/IOutput';
import { IUpdateSessionMeta } from 'Controls-DataEnv/newLists/_listDebug/debugger/Session';
import { TDebugMode } from 'Controls-DataEnv/newLists/_listDebug/debugger/types/TDebugMode';

// Получили от прикладника состояние
// Больше мы его менять по логике платформы не будем, но можем обработать исключения
export const printPhaseFour = (
    output: IOutput,
    meta: IUpdateSessionMeta,
    debugMode: TDebugMode
) => {
    _phase(output, meta, debugMode, 3, 'User logic after platform');
};
