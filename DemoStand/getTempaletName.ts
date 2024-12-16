export default function getTemplateName(path: string): string {
    // TODO Имя темы передаётся через путь в url по шаблону app/ИмяДемки/theme/ИмяТемы.
    //  Это попадает в имя демки, так как мы теперь берём весь путь после app/.
    //  По умному, надо бы имя темы передавать через query параметр.
    //  app тоже теперь не нужен, мы можем считать, что имя демки идёт сразу после DemoStand.
    //  Удалить после задач.
    //  https://online.sbis.ru/opendoc.html?guid=dafca847-8b99-41d9-86ca-96d41c982834&client=3
    //  https://online.sbis.ru/opendoc.html?guid=aef3c10b-29bf-4c72-a528-17354d2aa0e9&client=3
    return path.split('/theme/')[0].replace(/^app\//, '');
}
