/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */

import * as React from 'react';
/**
 * Класс, устанавливающий контекст, для подсветки контроллов при работе с клавиатуры
 * @private
 */

const Context = React.createContext(undefined);
export default Context;

export interface IWorkByKeyboardOptions {
    status: boolean;
    setStatus: (status: boolean) => void;
}

export interface IWorkByKeyboardContext {
    workByKeyboard?: IWorkByKeyboardOptions;
}
