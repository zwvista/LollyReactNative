/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
    // https://github.com/inversify/InversifyJS/issues/1007
    babelTransformerPath: require.resolve('react-native-typescript-transformer')
  },
};
