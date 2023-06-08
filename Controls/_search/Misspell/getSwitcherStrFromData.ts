/**
 * @kaizen_zone 1eafdb06-eb75-4353-b8d8-60b6cf34618f
 */
const SWITCHED_STR_FIELD = 'switchedStr';

function getSwitcherStrFromData(data) {
    const metaData = data && data.getMetaData();
    if (metaData && metaData.hasOwnProperty(SWITCHED_STR_FIELD)) {
        return metaData[SWITCHED_STR_FIELD];
    }

    // FIXME delete after https://online.sbis.ru/opendoc.html?guid=46b1d157-6458-42a9-b863-89bea9be9a7d
    return metaData && metaData.results
        ? metaData.results.get(SWITCHED_STR_FIELD)
        : '';
}

export = getSwitcherStrFromData;
