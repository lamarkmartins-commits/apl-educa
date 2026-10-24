import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Evita que a inicialização de muitos ambientes Angular/jsdom dispute CPU e cause timeouts.
    // O limite de duração de cada teste permanece o padrão do Vitest.
    maxWorkers: 2,
  },
});
