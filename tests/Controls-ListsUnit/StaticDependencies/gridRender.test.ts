import dependencyTest from './testEnv/dependencyTest';
import {
    ANY_NEW_PUBLIC_COMPONENT_LIBS,
    ANY_OLD_PUBLIC_COMPONENT_LIBS,
    ANY_DISPLAY_LIBS,
    LibPath,
    OMIT,
} from './testEnv/constants';

describe(LibPath.GridRender, () => {
    dependencyTest(
        LibPath.GridRender,
        [LibPath.ListsCommonLogic],
        [
            ...ANY_OLD_PUBLIC_COMPONENT_LIBS,
            ...ANY_NEW_PUBLIC_COMPONENT_LIBS,

            LibPath.ListVisualAspects,

            LibPath.GridReact,
            LibPath.TreeGridRender,

            // TODO: Убрать OMIT https://online.sbis.ru/opendoc.html?guid=6bc29d4e-9afe-439d-8b35-56907e12ea39&client=3
            ...OMIT(ANY_DISPLAY_LIBS, LibPath.GridDisplay),
            LibPath.ListWebReducers,
        ]
    );
});
