/* eslint-disable no-unused-vars */
const { JSDOM } = require('jsdom')
const chai = require('chai')
const chaiDom = require('chai-dom')

chai.use(chaiDom)

const jsdom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost' // añade una URL para evitar errores de "origen opaco"
})
const { window } = jsdom

function copyProps (src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .reduce((result, prop) => ({
      ...result,
      [prop]: Object.getOwnPropertyDescriptor(src, prop)
    }), {})
  Object.defineProperties(target, props)
}

global.window = window
global.document = window.document
global.navigator = {
  userAgent: 'node.js'
}

// Mock localStorage
const localStorageMock = (function () {
  let store = {}
  return {
    getItem (key) {
      return store[key] || null
    },
    setItem (key, value) {
      store[key] = value.toString()
    },
    removeItem (key) {
      delete store[key]
    },
    clear () {
      store = {}
    }
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

copyProps(window, global)
