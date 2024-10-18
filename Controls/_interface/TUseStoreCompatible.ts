/**
 * Общий тип для контролов, которые работают с Controls/Store и не грузят его в статических зависимостях
 * Тип используется для передачи в WasabyLoader/ModulesLoader:loadSync
 */
export type TStoreImport = typeof import('Controls/Store').default;
