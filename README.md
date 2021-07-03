# PostCSS px To em [![Build Status][ci-img]][ci]

[PostCSS] plugin to convert all `px` measurements to `em`.

```css
.foo {
  width: 270px;
  margin: 0 15px;
  padding: 1em;

  /* you can override pixel replacement by adding a "force" *
   * comment after the pixel measurement you want to keep.  */
  border-radius: 10px /*force*/ 16px;
}

@media (min-width: 640px) {
  /* doesn't change pixel values used for media queries, as this wouldn't work properly */
  .foo {
    width: 100%;
    padding: 10px;
  }
}
```

```css
.foo {
  width: 16.875em;
  margin: 0 0.9375em;
  padding: 1em;

  /* you can override pixel replacement by adding a "force" *
   * comment after the pixel measurement you want to keep.  */
  border-radius: 10px /*force*/ 1em;
}

@media (min-width: 640px) {
  /* doesn't change pixel values used for media queries, as this wouldn't work properly */
  .foo {
    width: 100%;
    padding: 0.625em;
  }
}
```

## Rationale

For [Bugherd], we needed to be able to scale our UIs to fit any zoom level on Mobile. To enable this, we change the parents' `font-size` and use `em` measurements relative to the base font size (usually `16px`) in our components. This PostCSS plugin facilitates this, without requiring us to rewrite all our code to use `em` manually.

## Usage

Plug it into your PostCSS configuration.

```js
var options = {
  base: 16, // (Number) Base font size; 16px by default
  globalEnabled: true, // (Boolean) Set global enabled status; true by default
  minPixelValue: 1, // (Number) Set the minimum pixel value to replace; 1px by default
  unitPrecision: 5, // (Number) The decimal numbers to allow the vw units to grow to; 5 by default
  exclude: [], // (Regexp or Array of Regexp) Ignore some files like 'node_modules'
  // If value is regexp, will ignore the matches files.
  // If value is array, the elements of the array are regexp.
  include: [], // (Regexp or Array of Regexp) If include is set, only matching files will be converted, for example, only files under src/mobile/ (include: /\/src\/mobile\//)
  // If the value is regexp, the matching file will be included, otherwise it will be excluded.
  // If value is array, the elements of the array are regexp.
};

// Options may be supplied as the first argument, but are not required.
postcss([require("postcss-px-to-em")(options)]);
```

### disable/enable the entire file

Add comment `/* px-to-em disabled|enabled */` on the head of file

```css
/* px-to-em disabled */
.foo {
  width: 270px;
  margin: 0 15px;
}
```

```css
.foo {
  width: 270px;
  margin: 0 15px;
}
```

See PostCSS docs for examples for your environment.

[bugherd]: https://macropod.com/bugherd
[postcss]: https://github.com/postcss/postcss
[ci-img]: https://travis-ci.org/macropodhq/postcss-px-to-em.svg
[ci]: https://travis-ci.org/macropodhq/postcss-px-to-em
