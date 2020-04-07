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

      const _fileReader = new FileReader();
      _fileReader.onloadend = onLoadEnd;

      const _this = this;

      this.__image = document.createElement('img');
      this.__imagePreview = document.createElement('img');
      this.__input = document.createElement('input');

      this.__image.src = object[property];
      this.__imagePreview.src = object[property];
      this.__input.type = 'file';

      dom.bind(this.__input, 'change', handleFileUpload);
      dom.bind(_fileReader, 'onloadend', onLoadEnd);

      dom.addClass(this.__imagePreview, 'preview');

      function handleFileUpload() {
        const file = _this.__input.files[0];
        if (!file) {
          return;
        }

        _fileReader.readAsDataURL(file);
      }

      function onLoadEnd() {
        _this.__image.src = _fileReader.result;
        _this.__imagePreview.src = _fileReader.result;

        if (_this.__onChange) {
          _this.__onChange.call(_this, _this.__image);
        }
      }

      this.domElement.appendChild(this.__imagePreview);
      this.domElement.appendChild(this.__input);
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
    this.__controllers.push(controller);

    return controller;
  };
};
