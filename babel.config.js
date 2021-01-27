// babel.config.js
module.exports = {

    presets: ['@babel/preset-flow', "@babel/preset-env", "@babel/preset-react"],
    plugins: ["@babel/plugin-proposal-class-properties", "@babel/plugin-syntax-dynamic-import", "@babel/plugin-transform-react-jsx"]
};