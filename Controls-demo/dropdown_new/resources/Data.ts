export function getItems(): any[] {
    const hierarchyItems = [
        { key: '1', title: 'Task in development', parent: null },
        { key: '2', title: 'Error in development', parent: null },
        { key: '3', title: 'Commission', parent: null },
        { key: '4', title: 'Assignment', parent: null },
        { key: '5', title: 'Coordination', '@parent': true },
        { key: '6', title: 'Development', '@parent': true },
        { key: '7', title: 'Assignment for accounting', parent: null },
        { key: '8', title: 'Assignment for delivery', parent: null },
        { key: '9', title: 'Assignment for logisticians', parent: null },
        { key: '102', title: 'Title 1', parent: '101' },
        { key: '103', title: 'Title 2', parent: '101' },
        { key: '104', title: 'Title 3', parent: '101' },
        { key: '105', title: 'Title 4', parent: '101' },
    ];

    const coordSub = [
        'Coordination',
        'Negotiate the discount',
        'Harmonization of price changes',
        'Approval of participation in trading',
        'Matching the layout',
        'Matching the layout of the mobile application',
        'Harmonization of the standard',
        'Harmonization of themes',
        'Harmonization of the mobile application standard',
        'Coordination of the change in a limited period',
        'Harmonization of the change of the contract template',
    ];

    const devSub = [
        'The task in development',
        'Merge request',
        'Error in development',
        'Run on the test bench',
        'Harmonization of changes in the database',
        'Changing the operation rule',
        'Creating (changing) a printed form',
        'The task of developing a standard component (test)',
        'Code review',
        'Service update',
        'Run on the working',
        'Adding / changing a sample application code',
        'Component development (test)',
        'Release report',
        'Acceptance of the project (functional testing)',
    ];

    if (hierarchyItems[4].parent !== null) {
        hierarchyItems[4].parent = null;
        for (let i = 0; i < coordSub.length; i++) {
            hierarchyItems.push({
                key: String(i + 10),
                title: coordSub[i],
                parent: String(5),
                '@parent': null,
            });
        }
        hierarchyItems[5].parent = null;
        for (let j = 0; j < devSub.length; j++) {
            hierarchyItems.push({
                key: String(j + 22),
                title: devSub[j],
                parent: String(6),
                '@parent': null,
            });
        }
    }
    return hierarchyItems;
}

export function getItemsDoNotSaveToHistory(): any[] {
    const items = getItems();
    return items.concat([
        {
            key: '100',
            title: 'Не сохраняется в историю',
            parent: null,
            doNotSaveToHistory: true,
        },
        {
            key: '101',
            title: 'Не сохраняется в историю с подменю',
            '@parent': true,
            parent: null,
            doNotSaveToHistory: true,
        },
    ]);
}

export function getFlatItems(): any[] {
    return [
        { key: 1, title: 'admin.sbis.ru' },
        { key: 2, title: 'booking.sbis.ru' },
        { key: 3, title: 'ca.sbis.ru' },
        { key: 4, title: 'ca.tensor.ru' },
        { key: 5, title: 'cloud.sbis.ru' },
        { key: 6, title: 'consultant.sbis.ru' },
        { key: 7, title: 'explain.sbis.ru' },
        { key: 8, title: 'genie.sbis.ru' },
        { key: 9, title: 'my.sbis.ru' },
        { key: 10, title: 'ofd.sbis.ru' },
        { key: 11, title: 'online.sbis.ru' },
        { key: 12, title: 'presto-offline' },
        { key: 13, title: 'retail-offline' },
        { key: 14, title: 'sbis.ru' },
        { key: 15, title: 'tensor.ru' },
        { key: 16, title: 'wi.sbis.ru' },
        { key: 17, title: 'dev-online.sbis.ru' },
        { key: 18, title: 'fix-online.sbis.ru' },
        { key: 19, title: 'fix-cloud.sbis.ru' },
        { key: 20, title: 'rc-online.sbis.ru' },
        { key: 21, title: 'pre-test-online.sbis.ru' },
        { key: 22, title: 'test-online.sbis.ru' },
    ];
}
