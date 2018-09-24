<style lang="less">
@import './index.less';
</style>

<template>
<div class="live-video">
  <div v-show="video" :ref="stream.streamId" class="live-video-main"></div>
  <div class="user-info">
    <p class="username">{{ username }}</p>
  </div>
  <div v-if="oneself" class="controls">
    <i class="control-btn" :class="[audio ? 'icon-mic on' : 'icon-mic-off']" @click="prohibitAudio"></i>
    <i class="control-btn icon-videocam" :class="{'on': video}" @click="prohibitVideo"></i>
    <i class="control-btn icon-arrows-cw"></i>
  </div>
  <div class="voice">
    <span class="voice-bar" :style="{'height': currentVolume * 10 + '%'}"></span>
  </div>
</div>
</template>

<script>
import hark from 'hark'

export default {
  props: ['stream', 'oneself'],

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
