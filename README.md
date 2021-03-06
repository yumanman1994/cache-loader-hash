<div align="center">
  <a href="https://webpack.js.org/">
    <img width="200" height="200" src="https://cdn.rawgit.com/webpack/media/e7485eb2/logo/icon-square-big.svg">
  </a>
</div>

# cache-loader-hash

Added the mode option to the `cache-loader` options, supporting `mtime` (default) and `hash`.

# Usage

```bash
npm install cache-loader-hash --save-dev
```

```js
webpackChain.module
  .rule('js') // or ts, tsx, vue...
  .use('cache-loader')
  .loader(require.resolve('cache-loader-hash'))
  .tap((options) => {
    options.mode = 'hash';
    return options;
  });
```

# No Breaking Change

No breaking change when using `mtime` mode.

# Why

We are doing a CI package acceleration work, which will store `node_modules/.cache` on `s3`, and then pull it from `s3` at a certain time. due to
The cache-loader uses `mtime` by default for cache verification, which causes the newly installed node_modules in the new CI process to not match the `mtime` of `node_modules/.cache` on `s3`. The solution to this problem is to use the hash of the file instead of mtime as the cache verification method of the cache-loader.

# License

MIT
