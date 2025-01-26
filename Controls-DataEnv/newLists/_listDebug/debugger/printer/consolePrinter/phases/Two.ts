import { IPhaseTwoMeta } from 'Controls-DataEnv/newLists/_listDebug/debugger/session/phases';
import { IOutput } from 'Controls-DataEnv/newLists/_listDebug/debugger/output/IOutput';
import { IUpdateSessionMeta } from 'Controls-DataEnv/newLists/_listDebug/debugger/Session';
import { TDebugMode } from 'Controls-DataEnv/newLists/_listDebug/debugger/types/TDebugMode';
import { _phase } from './_phase';

// Получили от прикладника состояние, оно может отличаться от того что мы передали.
// Это значит, что прикладник поменял состояние в _beforeApplyState перед вызовом супера.
// У нас есть состояние, которое мы отдали прикладнику и состояние, которое получили в платформенный bas.
export const printPhaseTwo = (output: IOutput, meta: IUpdateSessionMeta, debugMode: TDebugMode) => {
    _phase<IPhaseTwoMeta>(output, meta, debugMode, 1, 'User logic before platform');
};
