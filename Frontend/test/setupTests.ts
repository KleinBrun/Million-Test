import '@testing-library/jest-dom'; 
try {
  const vm: any = require('vm');

  if (!vm.constants || typeof vm.constants === 'object' && Object.keys(vm.constants).length === 0) {
    vm.constants = {
      ...vm.constants,
      DONT_CONTEXTIFY: 1,
    };
  }
} catch (e) {
  console.warn('[setupTests] No se pudo polyfillear vm.constants:', e);
}
