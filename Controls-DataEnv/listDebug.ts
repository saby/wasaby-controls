export { Debugger } from './newLists/_listDebug/Debugger';
import DebuggersStorage from './newLists/_listDebug/DebuggersStorage';
export { initLabel, deleteLabel, getLabel } from './newLists/_listDebug/Label';

export const getDebuggersStorage = () => {
    return DebuggersStorage.getInstance();
};

export const getDebuggers = () => {
    return getDebuggersStorage().getAll();
};

export const renderNew = (id?: string) => {
    getDebuggersStorage().renderNew(id);
};
