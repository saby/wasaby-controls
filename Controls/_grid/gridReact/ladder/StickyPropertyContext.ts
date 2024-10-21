/*
 * Файл содержит контекст, необходимый для корректной работы компонента LadderWrapper. Внутри LadderWrapper
 * необходим доступ к данным каждой ячейки, но так как LadderWrapper используется на стороне прикладного кода, то
 * единственный вариант - это оборачивать каждую ячейку лесенки в контекст и прокидывать данные через него.
 */

import * as React from 'react';

export const StickyPropertyContext = React.createContext<string | null>(null);
