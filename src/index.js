import './style.scss';
/**
 * dat.gui.image javascript plugin for dat.gui
 * @author jeremboo https://jeremieboulay.fr
 * @source https://github.com/Jeremboo/dat.gui.image
 */

export default (dat) => {
  const dom = dat.dom.dom;

  /**
   * @class Represents a image loaded throught its path, contains
   * the preview to the image path. Another image can be loaded by
   * clicking or dragging another image in the preview.
   *
   * @extends dat.controllers.Controller
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   */
  class ImageController extends dat.controllers.Controller {
    constructor(object, property) {
      super(object, property);

      this.__onChangeFirstTime = true;

      this.__fileReader = new FileReader();

      this.__image = document.createElement('img');
      this.__imagePreview = document.createElement('img');
      this.__input = document.createElement('input');

      this.__image.src = object[property];
      this.__imagePreview.src = object[property];
      this.__input.type = 'file';

      dom.bind(this.__image, 'load', this.handleImageLoaded.bind(this));
      dom.bind(this.__input, 'change', this.handleFileUpload.bind(this));
      dom.bind(this.__fileReader, 'loadend', this.handleFileLoaded.bind(this));

      dom.addClass(this.__imagePreview, 'preview');

      this.domElement.appendChild(this.__imagePreview);
      this.domElement.appendChild(this.__input);
    }

    handleFileUpload() {
      const file = this.__input.files[0];
      if (!file) {
        return;
      }
      this.__input.value = '';
      this.__fileReader.readAsDataURL(file);
    }

    handleFileLoaded() {
      this.handleFilePath(this.__fileReader.result);
    }

    handleFilePath(filePath) {
      if (!filePath) {
        return;
      }
      this.__image.src = filePath;
    }

    handleImageLoaded() {
      this.__imagePreview.src = this.__image.src;

      if (this.__onChange) {
        this.__onChange.call(this, this.__image, this.__onChangeFirstTime);
        this.__onChangeFirstTime = false;
      }
    }

    updateDisplay() {
      if (this.isModified()) {
        const newValue = this.getValue();
        this.handleFilePath(newValue);
        this.initialValue = newValue;
      }
      return super.updateDisplay();
    }
  }

  /**
   * * *******************
   * * INJECTED FUNCTION
   * * *******************
   */
  dat.GUI.prototype.addImage = function (object, property) {
    // Partial copy of the add() l.2301 from dat.gui.js
    if (object[property] === undefined) {
      throw new Error(
        'Object "' + object + '" has no property "' + property + '"'
      );
    }

    const controller = new ImageController(object, property);

    // Partial copy of the add() l.2316 from dat.gui.js
    // recallSavedValue(gui, controller);
    dom.addClass(controller.domElement, 'c');
    const name = document.createElement('span');
    dom.addClass(name, 'property-name');
    name.innerHTML = controller.property;
    const container = document.createElement('div');
    container.appendChild(name);
    container.appendChild(controller.domElement);

    // Copy of the addRow() l.2149 from dat.gui.js
    const li = document.createElement('li');
    if (container) {
      li.appendChild(container);
    }
    this.__ul.appendChild(li);
    this.onResize();

    // Partial copy of add() l.2149 from dat.gui.js
    dom.addClass(li, dat.GUI.CLASS_CONTROLLER_ROW);
    dom.addClass(li, 'image');
    // augmentController(gui, li, controller);

    // Partial copy of augmentController() l.922 from dat.gui.js
    controller.__li = li;
    controller.__gui = this;
    controller.name = function (name) {
      this.__li.firstElementChild.firstElementChild.innerHTML = name;
      return this;
    };
    controller.listen = function () {
      this.__gui.listen(this);
      return this;
    };
    controller.remove = function () {
      this.__gui.remove(this);
      return this;
    };

    this.__controllers.push(controller);

    return controller;
  };
};
