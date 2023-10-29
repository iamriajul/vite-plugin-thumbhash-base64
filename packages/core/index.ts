import {createFilter} from '@rollup/pluginutils'
import {createCanvas, loadImage} from '@napi-rs/canvas'
import type {Plugin, ResolvedConfig} from 'vite'
import {rgbaToThumbHash} from "thumbhash";

export type Options =
  | {
      include?: Array<string | RegExp> | string | RegExp
      exclude?: Array<string | RegExp> | string | RegExp
    }
  | undefined

const loader = (params: string) => {
  return `export default ${JSON.stringify(params)}`
}

async function loadImageAndConvertToRgba(path: string) {
  const maxSize = 100
  const imgPath = path
  const image = await loadImage(imgPath)
  const width = image.width
  const height = image.height

  const scale = maxSize / Math.max(width, height)
  const resizedWidth = Math.round(width * scale)
  const resizedHeight = Math.round(height * scale)

  const canvas = createCanvas(resizedWidth, resizedHeight)
  const ctx = canvas.getContext('2d')
  ctx.drawImage(image, 0, 0, resizedWidth, resizedHeight)

  const imageData = ctx.getImageData(0, 0, resizedWidth, resizedHeight)
  const rgba = new Uint8Array(imageData.data);
  return {
    rgba,
    width: resizedWidth,
    height: resizedHeight,
  };
}

const isThumbHash = (id: string) => {
  return id.endsWith('?th') || id.endsWith('?thumb')
}

const cleanId = (id: string) => id.replace('?thumb', '').replace('?th', '')

const thumbHash = (options: Options = {}): Plugin => {
  const { include, exclude } = options

  const filter = createFilter(include, exclude)

  let config: ResolvedConfig

  const devCache = new Map<string, string>()

  const buildCache = new Map<string, string>()

  return {
    name: 'vite-plugin-thumbhash-base64',
    enforce: 'pre',

    configResolved(cfg) {
      config = cfg
    },

    async load(id) {
      if (!filter(id)) {
        return null
      }

      if (isThumbHash(id)) {
        const cleanedId = cleanId(id)

        if (config.command === 'serve') {
          if (devCache.has(id)) {
            return devCache.get(id)
          }

          const {rgba, width, height} = await loadImageAndConvertToRgba(cleanedId)

          const hash = rgbaToThumbHash(width, height, rgba);

          const base64 = Buffer.from(hash).toString('base64');

          const loadedSource = loader(base64)

          devCache.set(id, loadedSource)

          return loadedSource
        }

        if (buildCache.has(id)) {
          return buildCache.get(id)
        }

        const {rgba, width, height} = await loadImageAndConvertToRgba(cleanedId)

        const hash = rgbaToThumbHash(width, height, rgba);

        const base64 = Buffer.from(hash).toString('base64');

        const loadedSource = loader(base64)

        buildCache.set(id, loadedSource)

        return loadedSource
      }

      return null
    },
  }
}

export { thumbHash }
