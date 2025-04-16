export type TZone = {
    name: string;
};

export type TTest = {
    name: string;
    zones: TZone[];
    meta: object;
};

export const createZone = (name: string): TZone => ({
    name,
});

export const createTest = (name: string, meta: object, ...zones: TZone[]): TTest => ({
    name,
    zones,
    meta,
});

type TResultItem = {
    id: string;
    parent: string | null;
    name: string;
} & (
    | {
          isZone: true;
      }
    | {
          isZone: false;
          meta: object;
      }
);

export const buildTestsTree = (tests: TTest[]): TResultItem[] => {
    const RESULT_ITEMS: TResultItem[] = [];

    const isStrictEqualArrays = (a: string[], b: string[]) =>
        a.length === b.length && a.every((item, i) => item === b[i]);

    const hasSubArray = (array: string[], subArray: string[]) =>
        subArray.every((item) => array.indexOf(item) !== -1);

    const normalizePath = (zones: TZone[]) => Array.from(new Set(zones.map((z) => z.name)));

    function omit<T>(array: T[], itemsToRemove: T[]): T[] {
        const result = new Set(array);

        new Set(itemsToRemove).forEach((value) => {
            if (result.has(value)) {
                result.delete(value);
            }
        });

        return Array.from(result.values());
    }

    const getOwnTests = (allTests: TTest[], zonesPath: TZone[]): TTest[] => {
        const expected = normalizePath(zonesPath);
        return allTests.filter((t) => isStrictEqualArrays(normalizePath(t.zones), expected));
    };

    const getZoneAllTests = (allTests: TTest[], zonesPath: TZone[]): TTest[] => {
        const expected = normalizePath(zonesPath);
        return allTests.filter((t) => hasSubArray(normalizePath(t.zones), expected));
    };

    const getSubZones = (allTests: TTest[], zonesPath: TZone[]): TZone[][] => {
        const zoneOwnTests = getOwnTests(allTests, zonesPath);
        const zoneAllTests = getZoneAllTests(allTests, zonesPath);
        return omit(zoneAllTests, zoneOwnTests).map((test) => test.zones);
    };

    const getRootZones = (allTests: TTest[]): TZone[] => {
        const zonesSet = new Set<TZone>();
        allTests.forEach(({ zones }) => {
            zones.forEach((z) => {
                zonesSet.add(z);
            });
        });
        return Array.from(zonesSet);
    };

    const build = (allTests: TTest[]) => {
        getRootZones(allTests).flatMap((z) => buildZone(allTests, [z], null));
    };

    const buildZone = (allTests: TTest[], currentZonePath: TZone[], parent: string | null) => {
        const zoneId = `zone-${parent}-${normalizePath(currentZonePath).join('-and-')}`;
        const zoneName = `${normalizePath(currentZonePath).join('+')}`;
        RESULT_ITEMS.push({
            id: zoneId,
            parent,
            isZone: true,
            name: zoneName,
        });
        getOwnTests(allTests, currentZonePath).forEach((test, index) => {
            RESULT_ITEMS.push({
                id: `${zoneId}-${index}`,
                parent: zoneId,
                name: test.name,
                isZone: false,
                meta: test.meta,
            });
        });

        getSubZones(allTests, currentZonePath).flatMap((subZonePath) =>
            buildZone(allTests, subZonePath, zoneId)
        );
    };

    build(tests);
    return RESULT_ITEMS;
};
