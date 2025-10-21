try {
    const vm = require('vm');

    if (!vm.constants || (typeof vm.constants === 'object' && Object.keys(vm.constants).length === 0)) {
        vm.constants = {
            ...vm.constants,
            DONT_CONTEXTIFY: 1,
        };
        console.log('[polyfill] vm.constants.DONT_CONTEXTIFY applied');
    } else {
        console.log('[polyfill] vm.constants already present');
    }
} catch (e) {
    console.warn('[polyfill] error applying vm.constants polyfill', e);
}
