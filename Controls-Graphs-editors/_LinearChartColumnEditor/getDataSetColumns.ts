// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { RecordSet } from 'Types/collection';
import { BaseBindingFacade } from 'Frame/base';
import { Query } from 'Types/source';
import { Logger } from 'UI/Utils';
import { FieldListSource } from 'Frame-DataEnv/dataLoader';

/**
 * Возвращает описание колонок выборки из сервиса мета-типов
 * @param bindingFacade
 */
async function getDataSetColumns(
    bindingFacade: BaseBindingFacade,
    aggregateFields?: boolean
): Promise<RecordSet | undefined> {
    if (!bindingFacade) {
        return;
    }
    try {
        // @ts-expect-error wrong init params
        const source = new FieldListSource();
        const query = new Query().where({
            Ids: [bindingFacade?.getDataSetName?.()],
            Types: ['dataset'],
            Parent: bindingFacade?.getDataSetName?.(),
            Purpose: aggregateFields ? 'Aggregate' : null,
        }) as {};
        const dataset = await source.query(query as Query<{}>);
        return dataset.getAll();
    } catch (error) {
        Logger.error(
            (error as Error)?.message,
            'Controls-Graphs-editors/_LinearChartColumnEditor:getDataSetColumns'
        );
    }
}

export { getDataSetColumns };
