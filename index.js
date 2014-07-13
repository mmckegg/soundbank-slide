var CustomAudioParam = require('custom-audio-node/audio-param')
var extendTransform = require('audio-param-transform')

module.exports = Slide

function Slide(audioContext){

  if (!(this instanceof Slide)){
    return new Slide(audioContext)
  }

  this._valueLookup = audioContext.portmantoValues = audioContext.portmantoValues || {}

  this.time = 0.5
  this.value = CustomAudioParam(audioContext, 'value')
  this._slideModifier = CustomAudioParam(audioContext, 'slideModifier')
  this.group = null
  this._targets = []
  this.context = audioContext
}

Slide.prototype = {

  constructor: Slide,

  start: function(at){
    var value = this.value.value || 0
    var lastValue = this._valueLookup[this.group] || value
    var difference = (lastValue - value) || 0

    if (difference != 0){
      this._slideModifier.setValueAtTime(difference, at)
      this._slideModifier.linearRampToValueAtTime(0, at+this.time)
    }

    this._valueLookup[this.group] = value
  },

  stop: function(at){

  },

  connect: function(param){
    if (!~this._targets.indexOf(param)){
      this._targets.push(param)
      extendTransform(param, this.context)
      param.clearTransforms()

      this.value.addTarget(param.transform(param.value))      
      this._slideModifier.addTarget(param.transform(add, 0))
    }
  },

  disconnect: function(){
    this.value.clearTargets()
    this._slideModifier.clearTargets()
    this._targets.length = 0
  }

}

function add(a,b){
  return a + b
}