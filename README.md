# dat.GUI.image

Plugin to give you another GUI function called `addImage()`. It allows you to update an image in real time without recompiling your code or add an image into your project.

It's really useful for instance to quickly try multiple textures during prototyping!
Or to set up some good tools for designers.

<p align="center">
    <img alt="Creative Coding TO - Demo" src="https://github.com/Jeremboo/dat.gui.image/blob/master/preview.gif?raw=true">
</p>

## How to use

```
 npm install --save dat.gui.image
```

```javascript
import dat from 'dat.gui';

// The magic here!
import datGuiImage from 'dat.gui.image';
datGuiImage(dat);


const PROPS = {
  texturePath: 'image.png';
};

const gui = new dat.GUI();

// Now, you can use it as a traditional gui method!
gui.addImage(PROPS, 'texturePath').onChange((image) => {
  body.append(image);
});
```

## Todo / next steps

- Make it works with the `augmentController()` & `recallSavedValue()` functions.

- Once one of those PRs is merged, only export the ImageController class:

  - https://github.com/dataarts/dat.gui/pull/243
  - https://github.com/dataarts/dat.gui/pull/232

* UX improvements:
  - Show/hide button to collapse the controller
  - Add a loader
  - Add the image name
