import { IListDataFactory } from 'Controls/dataFactory';
import { Query, SbisService } from 'Types/source';
import { factory } from 'Types/chain';

export function getLeadItems(options) {
    const filter = new Query().where(options.filter || {});
    return new SbisService({
        endpoint: {
            contract: 'CRMTheme',
        },
        binding: {
            query: 'ThemesSelector',
        },
    })
        .query(filter)
        .then(function (data) {
            const rs = data.getAll();
            return {
                needWrap: true,
                wrapName: options.wrapName,
                opener: options.opener,
                icon: options.icon,
                group: options.group,
                subGroup: options.subGroup,
                items: factory(rs)
                    .map(function (record) {
                        return {
                            group: options.group,
                            name: record.get('Название'),
                            parent: record.get('Раздел'),
                            objectId: record.get('Идентификатор'),
                            historyId: options.objectName,
                            '@parent': record.get('Раздел@'),
                            id: record.get('Идентификатор'),
                            elementId: record.get('Идентификатор'),
                            opener: options.opener,
                            itemRecord: record,
                            themeData: {
                                '@Регламент': record.get('@Регламент'),
                            },
                        };
                    })
                    .value(),
            };
        });
}

const listDataFactory: IListDataFactory = {
    loadData: (config) => {
        return getLeadItems(config);
    },
};

export default listDataFactory;
