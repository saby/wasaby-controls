import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { Query, DataSet } from 'Types/source';
import { SbisService } from 'Types/source';
import getFilterDescriptionFromDataSet from 'Controls/Utils/getFilterDescriptionFromDataSet';
import { constants } from 'Env/Env';

const ROOT_FRAME_NAME = 'FrameControls/rootLayout:RootLayout';

interface IEditingFrameFacadeConstructor {
    new (options: unknown): any;
    makeElementFromMeta: Function;
}

async function loadFilterData(dataSetName: string, filter: Record<string, unknown>) {
    const dataSet: DataSet = await new SbisService({
        endpoint: {
            contract: 'EntityCatalog',
            address: '/metadata-repository/service/',
        },
        binding: { query: 'HierarchyList' },
    }).query(
        new Query().where({
            CustomFilter: {
                Ids: [dataSetName],
                MetaType: 'dataset',
                MetaAttributes: {
                    purpose: 'Filter',
                },
            },
            LeafType: 'ObjectField',
            Version: constants.buildnumber,
        })
    );
    return getFilterDescriptionFromDataSet(dataSet, filter);
}

export async function createWidgetFromFilter(
    widgetName: string,
    dataSetName: string,
    filter: Record<string, unknown>
): Promise<void> {
    const [{ loadMetaAsync }, { EditingFrameFacade }, { saveWidget }, { copyCallback }] =
        await Promise.all([
            loadAsync('Frame/base') as Promise<{ loadMetaAsync: Function }>,
            loadAsync('FrameEditor/base') as Promise<{
                EditingFrameFacade: IEditingFrameFacadeConstructor;
            }>,
            loadAsync('FrameEditor/widgetConstructor') as Promise<{ saveWidget: Function }>,
            loadAsync('SiteEditorBase/widgetActions') as Promise<{ copyCallback: Function }>,
        ]);
    const widgetMeta = await loadMetaAsync(widgetName);
    const rootMeta = await loadMetaAsync(ROOT_FRAME_NAME);

    const elementFacade = EditingFrameFacade.makeElementFromMeta(widgetMeta);
    const rootElementFacade = EditingFrameFacade.makeElementFromMeta(rootMeta);

    const elementFacadeModified = elementFacade.modify({
        staticProperties: {
            ...elementFacade.getStaticProperties(),
            filter: await loadFilterData(dataSetName, filter),
        },
    });

    const widgetFrame = new EditingFrameFacade({
        content: [
            rootElementFacade.modify({
                contentProperties: {
                    children: [elementFacadeModified],
                },
            }),
        ],
    });
    const widgetType = await saveWidget({
        constructorId: 'WidgetConstructor',
        frame: widgetFrame.toJSONML(),
        meta: {
            title: widgetName,
        },
    });
    copyCallback(null, { widgetType }, { withoutSave: true });
}
