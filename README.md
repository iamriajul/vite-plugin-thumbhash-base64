# `vite-plugin-thumbhash-base64`

Add [ThumbHash](https://github.com/evanw/thumbhash) to your vite project.

## Install

```shell
npm install vite-plugin-thumbhash-base64 --save-dev
```

```shell
pnpm add vite-plugin-thumbhash-base64 -D
```

## Usage

```ts
import { defineConfig } from 'vite'
import { thumbHash } from 'vite-plugin-thumbhash-base64'

export default defineConfig({
  plugins: [thumbHash()]
})
```

```jsx
import ImageHash from 'example.jpg?thumb'

//...
<img
//...
data-hash={ImageHash}
/>
```

## TypeScript IntelliSense

Add the following code to `vite-env.d.ts` :
```ts
/// <reference types="vite-plugin-thumbhash-base64/client" />
```

## Options

```ts
type Options =
    {
      /**
       * A picomatch pattern, or array of patterns, 
       * which specifies the files in the build the plugin should operate on. 
       */
      include?: Array<string | RegExp> | string | RegExp
      /**
       * A picomatch pattern, or array of patterns,
       * which specifies the files in the build the plugin should ignore.
       */
      exclude?: Array<string | RegExp> | string | RegExp
    }
```

## Example

see [playground](/packages/playground/)

## License

MIT
