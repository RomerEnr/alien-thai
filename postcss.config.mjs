import postcssGlobalData from '@csstools/postcss-global-data';
import postcssCustomMedia from 'postcss-custom-media';

/** Makes the breakpoints in src/styles/custom-media.css available to every stylesheet, scoped ones included. */
export default {
  plugins: [
    postcssGlobalData({ files: ['./src/styles/custom-media.css'] }),
    postcssCustomMedia(),
  ],
};
