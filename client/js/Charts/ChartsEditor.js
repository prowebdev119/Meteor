import draggableCharts from "./draggableCharts";
import resizableCharts from "./resizableCharts";

/**
 * @param {CallableFunction} onEnable
 * @param {CallableFunction} onDisable
 */
export default class ChartsEditor {
  constructor(onEnable, onDisable) {
    this.mode = false;
    this.onEnable = onEnable;
    this.onDisable = onDisable;

    this.debug = false;

    this.bindEvent();
  }

  bindEvent() {
    if (this.mode == true) {
      this._onEnabled();
      this.onEnable();
    } else {
      this._onDisabled();
      this.onDisable();
    }
  }

  _refreshElements() {
    const editorElements = document.querySelectorAll(".editor-js");
    editorElements.forEach((ele) => {
      const attribute = ele.getAttribute("on-editor-active");

      if (this.mode == true) {
        if (attribute == "hide") {
          ele.style.display = "none";
        } else {
          ele.style.display = "";
        }
      } else {
        if (attribute == "hide") {
          ele.style.display = "";
        } else {
          ele.style.display = "none";
        }
      }
    });
  }

  _onEnabled() {
    this._refreshElements();
    // draggableChart.activate();
    // resizableCharts.enable();
  }

  _onDisabled() {
    this._refreshElements();
    // draggableChart.disable();
    // resizableCharts.disable();
  }

  enable() {
    this.mode = true;

    this._onEnabled();
    this.onEnable();
    if (this.debug == true) {
      console.log("Editor: " + this.mode);
    }
  }

  disable() {
    this.mode = false;

    this._onDisabled();
    this.onDisable();
    if (this.debug == true) {
      console.log("Editor: " + this.mode);
    }
  }
}
