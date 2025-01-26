function onCounterClick(counter): void {
    if (counter) {
        alert(counter.value);
    } else {
        alert('Клик по стрелке');
    }
}

onCounterClick._moduleName =
    'Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/MasterCounter/OnCounterClick';

export = onCounterClick;
