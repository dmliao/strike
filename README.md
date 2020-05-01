# Strike

A 1-bit painting app with some PWA support, for quick sketching or line drawing.

## Features

* brush / eraser / fill tools with different brush shapes and sizes
* 16-'color' palette via dither patterns. Each pattern is treated as a separate color for fill tool
* ~50 step undo / redo (it's fragile, so don't rely on it too much)
* import PNG and JPG files, which will be converted to 1 bit form
* zoom via mouse scroll or two-finger pinch
* basic image transform tools (flip / mirror / resize canvas)
* save images as a 16-color greyscale (which will import back into Strike with all patterns intact), or as 1-bit black and white image
* autosaving (see notes)

## Notes

Strike is not meant to be a full-featured paint app, so has quite a few limitations. 

* Undo / redo may slow down for large strokes or complex drawings. If they behave strangely, please file a bug report.
* There is a limited autosave feature; by default, starting up Strike will load up the previously drawn image. Creating a new canvas will erase the autosave. You can disable autosaves via the settings (gear) menu. Strike only autosaves one image at a time, so please regularly export your work.

## How to build locally

There is no build step! Unzip the project directory, point your favorite http server at it, and the app will show up on localhost. I tend to use `http-server`:

```
cd path/to/strike/folder
npx http-server .
```

### What about package.json?

If you just want to run the app, there's no need to run `npm install` - all the things needed to run the app should already be in the directory.

However, if you want to edit the app, it might be useful to install dependencies. There are a few helper scripts I wrote for specific functionality:

**npm run vendor** - takes the minified third-party dependencies from `node_modules` and copies them to the `src/vendor` folder, where they're consumed by the app

**npm run pwa** - generates splash screens and icons for making Strike into a progressive web app. I usually run `./tools/compress.js` afterwards to further compress the images down.

**npm run zip** - packages the app into a zip file for distribution as a download.