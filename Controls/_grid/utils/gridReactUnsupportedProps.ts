// 1. Эти опции легальны, но нужна проверка по свойствам объекта
// columns
// header (возможно не все подопции совместимы)
// footer (возможно не все подопции совместимы)

// 2. ВСЕГДА ПО УМОЛЧАНМЮ ЗАДАНО на уровне BaseControl или DataContextCompatible.
// GridReact уже с этим строится, поэтому наличие этих опций в unsupported лишь спровоцирует ошибку гидрации.
// attachLoadTopTriggerToNull
// style
// urlProperty
// trackedPropertiesTemplate
// keepScrollAfterReload
// selectionCountMode
// selectionType
// collapsedItems
// hasChildrenProperty

// 3. Может быть задано на ItemsView, и это легально
// keyProperty
// nodeProperty
// parentProperty
// root

const gridUnsupportedOptions: string[] = ['multiSelectTemplate', 'itemTemplateProperty'];

const treeGridUnsupportedOptions: string[] = [
    'nodeHistoryId',
    'nodeHistoryType',
    'childrenCountProperty',
    'deepReload',
    'nodeLoadCallback',
    'deepScrollLoad',
];

const unsupportedProps = gridUnsupportedOptions.concat(treeGridUnsupportedOptions);

export default unsupportedProps;
