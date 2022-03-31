const { alias } = require('react-app-rewire-alias');

module.exports = function override(config) {
  alias({
    '@components': 'src/components',
    '@lib': 'src/lib',
    '@ressources': 'src/ressources',
    '@translations': 'src/translations',
})(config);

  return config;
};
