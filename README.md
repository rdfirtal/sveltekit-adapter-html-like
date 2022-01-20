# sveltekit-adapter-html-like

[Adapter](https://kit.svelte.dev/docs#adapters) for SvelteKit apps that prerenders your site as static files for template engines such as PHP, Blade, Handlebars, EJS etc.

This package is a fork of [@sveltejs/adapter-static](https://github.com/sveltejs/kit/tree/master/packages/adapter-static) that adds a couple of extra features:

- tag injection
- string replacement
- minify/prettify output
- custom file extensions

## Usage

Install with `npm i -D sveltekit-adapter-html-like`, then add the adapter to your `svelte.config.js`:

```js
// svelte.config.js
import adapter from 'sveltekit-adapter-html-like';

export default {
  kit: {
    adapter: adapter()
  }
};
```

Unless you're in [SPA mode](#spa-mode), the adapter will attempt to prerender every page of your app, regardless of whether the [`prerender`](https://kit.svelte.dev/docs#ssr-and-javascript-prerender) option is set.

## Options

### pages

Type: `string`  
Default: `build`

The directory to write prerendered pages to. It defaults to `build`.

### assets

Type: `string`  
Default: `build`

The directory to write static assets (the contents of `static`, plus client-side JS and CSS generated by SvelteKit) to. Ordinarily this should be the same as `pages`, and it will default to whatever the value of `pages` is, but in rare circumstances you might need to output pages and assets to separate locations.

### fallback

Type: `string`  
Default: `null`

Specify a fallback page for SPA mode, e.g. `index.html` or `200.html` or `404.html`.

### precompress

Type: `boolean`  
Default: `false`

If `true`, precompresses files with brotli and gzip. This will generate `.br` and `.gz` files.

### injectTo

Type: `object`  
Default: `{}`

Allows the injection of markup, valid HTML or otherwise, into the `<head>` or `<body>`. You can use the same positions as [`insertAdjacentHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML):

- `beforebegin`
- `afterbegin`
- `beforeend`
- `afterend`

**Example**

Let's inject some WordPress tags into the page

```js
adapter({
  injectTo: {
    head: {
      beforeend: ['<?php wp_head(); ?>']
    },
    body: {
      beforeend: ['<?php wp_footer(); ?>']
    }
  },
  targetExtension: '.php'
});
```

### replace

Type: `array`  
Default: `[]`

String replacements run on every page

**Example**

Once again, a WordPress example

```js
adapter({
  replace: [
    {
      from: '<html lang="en">',
      to: '<html <?php language_attributes(); ?>>'
      // many: true (optional)
    }
  ],
  targetExtension: '.php'
});
```

### minify

Type: `boolean`  
Default: `false`

Enable minification of output files

### targetExtension

Type: `string`  
Default: `.html`

Modifies the extension of the target file, e.g. `.php` or `.hbs`

## SPA mode

You can use `sveltekit-adapter-html-like` to create a single-page app or SPA by specifying a **fallback page**.

> In most situations this is not recommended: it harms SEO, tends to slow down perceived performance, and makes your app inaccessible to users if JavaScript fails or is disabled (which happens [more often than you probably think](https://kryogenix.org/code/browser/everyonehasjs.html)).

The fallback page is a blank HTML page that loads your SvelteKit app and navigates to the correct route. For example [Surge](https://surge.sh/help/adding-a-200-page-for-client-side-routing), a static web host, lets you add a `200.html` file that will handle any requests that don't otherwise match. We can create that file like so:

```js
// svelte.config.js
import adapter from 'sveltekit-adapter-html-like';

export default {
  kit: {
    adapter: adapter({
      fallback: '200.html'
    })
  }
};
```

When operating in SPA mode, only pages that have the [`prerender`](https://kit.svelte.dev/docs#ssr-and-javascript-prerender) option set will be prerendered.

## License

[MIT](LICENSE)
