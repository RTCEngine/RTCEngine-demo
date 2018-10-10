<style lang="less">
@import './index.less';
</style>

<template>
<div class="video-item">
  <div v-show="video" :ref="stream.streamId" class="video-main"></div>
  <span class="microphone" :class="{'disabled': !audio }" @click="prohibitAudio"></span>
  <span class="camera" :class="{'disabled': !video }" @click="prohibitVideo"></span>
  <div class="opa-bg"><p class="video-username">{{ username }}</p></div>
  <div class="voice">
    <span class="voice-bar" :style="{'height': currentVolume * 10 + '%'}"></span>
  </div>
</div>
</template>

<script>
import hark from 'hark'

export default {
  props: ['stream'],

  data () {
    return {
      audio: true,
      video: true,
      currentVolume: 0,
      username: ''
    }
  },

  created () {
    this.username = this.stream && this.stream.attributes.username
    this.createdHark(this.stream.mediastream)
  },

  mounted () {
    this.$refs[this.stream.streamId].appendChild(this.stream.videoElement)
  },

  methods: {
    createdHark (stream) {
      this.speech && this.speech.stop && this.speech.stop()
      this.speech = hark(stream, {
        interval: 150,
        threshold: -50,
        play: !('' + this.userId === this.stream.peerId)
      })
      this.speech.on('stopped_speaking', () => {
        this.currentVolume = 0
      })
      this.speech.on('volume_change', (dBs) => {
        let volume = Math.round(Math.pow(10, dBs / 85) * 10)
        if (volume === 1) {
          volume = 0
        }
        if (volume !== this.currentVolume) {
          this.currentVolume = volume
        }
      })
    },

    prohibitAudio () {
      this.currentVolume = 0
      this.audio = !this.audio
      this.stream.muteAudio(!this.audio)
    },

    prohibitVideo () {
      this.video = !this.video
      this.stream.muteVideo(!this.video)
    }
  }
}
</script>
