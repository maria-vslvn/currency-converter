/** @type {import('prettier').Config} */
export default {
    semi: true,
    singleQuote: true,
    jsxSingleQuote: false,
    trailingComma: 'all',
    tabWidth: 4,
    useTabs: false,
    printWidth: 100,
    bracketSpacing: true,
    bracketSameLine: false,
    arrowParens: 'always',
    endOfLine: 'lf',

    plugins: ['prettier-plugin-tailwindcss'],
    tailwindStylesheet: './src/index.css',
};
