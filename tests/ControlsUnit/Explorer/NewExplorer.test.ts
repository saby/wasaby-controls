import { generatePath, TestExplorer } from 'ControlsUnit/Explorer/TestExplorer';

describe('Explorer', () => {
    it('detect isGoingBack by search from root', () => {
        // Создаем тестовый explorer с данными хлебных крошек
        const explorer = new TestExplorer();
        explorer.setBreadcrumbs(generatePath(2));

        // Переключаемся в режим поиска и сбрасываем хлебные крошки
        explorer.setViewMode('search');
        explorer.changeBreadcrumbs(null);

        // После перехода в режим поиска и сброса крошек флаг isGoingBack должен быть false
        const state = explorer.getState();
        expect(state.isGoingBack).toBe(false);
    });
});
