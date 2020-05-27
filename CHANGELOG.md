# 0.3.0

* Add keyboard shortcuts for undo and redo.

# 0.2.1

* Fix bug where changing brush size and then setting brush size back to 1 would cause it to be offset by a pixel.

# 0.2.0

* Added `image-rendering: optimizeSpeed;` to the canvas CSS so that the canvas remains sharp on Firefox
* Updated both artwork and palette to not auto-refresh per frame, instead manually redrawing for performance purposes.
* Gracefully degrade autosaving if browser doesn't have access to localStorage.

# 0.1.0

Initial release!