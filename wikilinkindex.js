/**
 * Build styles
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('./index.css').toString()

/**
 * Base WikiLinkParagraph Block for the Editor.js.
 * Represents simple WikiLinkParagraph
 *
 * @author CodeX (team@codex.so)
 * @copyright CodeX 2018
 * @license The MIT License (MIT)
 */

/**
 * @typedef {object} WikiLinkParagraphConfig
 * @property {string} placeholder - placeholder for the empty WikiLinkParagraph
 * @property {boolean} preserveBlank - Whether or not to keep blank WikiLinkParagraphs when saving editor data
 */

/**
 * @typedef {Object} WikiLinkParagraphData
 * @description Tool's input and output data format
 * @property {String} text — WikiLinkParagraph's content. Can include HTML tags: <a><b><i>
 */
class WikiLinkParagraph {
  /**
   * Default placeholder for WikiLinkParagraph Tool
   *
   * @return {string}
   * @constructor
   */
  static get DEFAULT_PLACEHOLDER() {
    return ''
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {object} params - constructor params
   * @param {WikiLinkParagraphData} params.data - previously saved data
   * @param {WikiLinkParagraphConfig} params.config - user config for Tool
   * @param {object} params.api - editor.js api
   * @param {boolean} readOnly - read only mode flag
   */
  constructor({ data, config, api, readOnly }) {
    this.api = api
    this.readOnly = readOnly
    this.config = config
    this.FunctionButton = config.FunctionButton
    this.SetWikiID = config.SetWikiID

    this._CSS = {
      block: this.api.styles.block,
      wrapper: 'ce-exparagraph',
    }

    if (!this.readOnly) {
      this.onKeyUp = this.onKeyUp.bind(this)
    }

    /**
     * Placeholder for WikiLinkParagraph if it is first Block
     * @type {string}
     */
    this._placeholder = config.placeholder
      ? config.placeholder
      : WikiLinkParagraph.DEFAULT_PLACEHOLDER
    this._data = {}
    this._element = this.drawView()
    this._preserveBlank =
      config.preserveBlank !== undefined ? config.preserveBlank : false

    this.data = data
  }

  /**
   * Check if text content is empty and set empty string to inner html.
   * We need this because some browsers (e.g. Safari) insert <br> into empty contenteditanle elements
   *
   * @param {KeyboardEvent} e - key up event
   */
  onKeyUp(e) {
    if (e.code !== 'Backspace' && e.code !== 'Delete') {
      return
    }

    const { textContent } = this._element

    if (textContent === '') {
      this._element.innerHTML = ''
    }
  }

  /**
   * Create Tool's view
   * @return {HTMLElement}
   * @private
   */
  drawView() {
    let div = document.createElement('DIV')

    div.classList.add(this._CSS.wrapper, this._CSS.block)
    div.contentEditable = false
    div.dataset.placeholder = this.api.i18n.t(this._placeholder)

    if (!this.readOnly) {
      div.contentEditable = true
      div.addEventListener('keyup', this.onKeyUp)
    }

    /*
   
*/
    return div
  }

  /**
   * Return Tool's view
   *
   * @returns {HTMLDivElement}
   */
  render() {
    return this._element
  }

  /**
   * Method that specified how to merge two Text blocks.
   * Called by Editor.js by backspace at the beginning of the Block
   * @param {WikiLinkParagraphData} data
   * @public
   */
  merge(data) {
    let newData = {
      text: this.data.text + data.text,
    }

    this.data = newData
  }

  /**
   * Validate WikiLinkParagraph block data:
   * - check for emptiness
   *
   * @param {WikiLinkParagraphData} savedData — data received after saving
   * @returns {boolean} false if saved data is not correct, otherwise true
   * @public
   */
  validate(savedData) {
    if (savedData.text.trim() === '' && !this._preserveBlank) {
      return false
    }

    return true
  }

  /**
   * Extract Tool's data from the view
   * @param {HTMLDivElement} toolsContent - WikiLinkParagraph tools rendered view
   * @returns {WikiLinkParagraphData} - saved data
   * @public
   */
  save(toolsContent) {
    return {
      text: toolsContent.innerHTML,
    }
  }

  /**
   * On paste callback fired from Editor.
   *
   * @param {PasteEvent} event - event with pasted data
   */
  onPaste(event) {
    const data = {
      text: event.detail.data.innerHTML,
    }

    this.data = data
  }

  /**
   * Enable Conversion Toolbar. WikiLinkParagraph can be converted to/from other tools
   */
  static get conversionConfig() {
    return {
      export: 'text', // to convert WikiLinkParagraph to other block, use 'text' property of saved data
      import: 'text', // to covert other block's exported string to WikiLinkParagraph, fill 'text' property of tool data
    }
  }

  /**
   * Sanitizer rules
   */
  static get sanitize() {
    return {
      text: {
        br: true,
        b: true,
        div: true,
      },
    }
  }

  /**
   * Returns true to notify the core that read-only mode is supported
   *
   * @return {boolean}
   */
  static get isReadOnlySupported() {
    return true
  }

  /**
   * Get current Tools`s data
   * @returns {WikiLinkParagraphData} Current data
   * @private
   */
  get data() {
    let text = this._element.innerHTML

    this._data.text = text

    return this._data
  }

  /**
   * Store data in plugin:
   * - at the this._data property
   * - at the HTML
   *
   * @param {WikiLinkParagraphData} data — data to set
   * @private
   */
  set data(data) {
    this._data = data || {}

    this._element.innerHTML = this._data.text || ''
    var target_element = this._element.getElementsByClassName('hover-link')

    console.log(
      'F5',
      target_element,
      this._data,
      this._data.text,
      this._element
    )
    var f_button = this.FunctionButton
    var f_setwikiid = this.SetWikiID

    console.log('FunctionButton2!!!', this.FunctionButton, this.SetWikiID)

    console.log('F5_t', target_element)
    if (target_element == null) return
    if (
      !(
        this.FunctionButton == null ||
        this.SetWikiID == null ||
        target_element == null
      )
    ) {
      for (var i = 0; i < target_element.length; i++) {
        console.log('F5_for', target_element[i].textContent)
        var _textdata = target_element[i].textContent

        f_button = this.FunctionButton
        f_setwikiid = this.SetWikiID
        target_element[i].onclick = function () {
          console.log('setwikiid', _textdata)
          f_setwikiid(_textdata)
          f_button()
        }
      }
    }
  }

  /**
   * Used by Editor paste handling API.
   * Provides configuration to handle P tags.
   *
   * @returns {{tags: string[]}}
   */
  static get pasteConfig() {
    return {
      tags: ['span'],
    }
  }

  static get enableLineBreaks() {
    return true
  }

  /**
   * Icon and title for displaying at the Toolbox
   *
   * @return {{icon: string, title: string}}
   */

  /*
  static get toolbox() {
    return {
      icon: `<svg width="19" height="4" viewBox="0 0 19 4" xmlns="http://www.w3.org/2000/svg"><path d="M1.25 0H7a1.25 1.25 0 1 1 0 2.5H1.25a1.25 1.25 0 1 1 0-2.5zM11 0h5.75a1.25 1.25 0 0 1 0 2.5H11A1.25 1.25 0 0 1 11 0z"/></svg>`,
      title: 'wikiparagraph',
    }
  }*/
}

//module.exports = WikiLinkParagraph

export default WikiLinkParagraph
