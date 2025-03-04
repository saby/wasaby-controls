import { _phase } from './_phase';
import { IOutput } from 'Controls-DataEnv/newLists/_listDebug/debugger/output/IOutput';
import { IUpdateSessionMeta } from 'Controls-DataEnv/newLists/_listDebug/debugger/Session';
import { TDebugMode } from 'Controls-DataEnv/newLists/_listDebug/debugger/types/TDebugMode';

// Основная платформенная логика.
// "Тяжелая" логика с загрузкой данных, статики и долгими вычислениями.
export const printPhaseThree = (
    output: IOutput,
    meta: IUpdateSessionMeta,
    debugMode: TDebugMode
) => {
    _phase(output, meta, debugMode, 2, 'Platform logic');
};
