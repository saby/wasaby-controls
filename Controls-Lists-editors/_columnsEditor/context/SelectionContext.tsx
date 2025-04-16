import * as React from 'react';

/**
 * Контекст, содержащий информацию об отмеченных колонках
 */
export const SelectionContext = React.createContext<boolean[]>([]);
