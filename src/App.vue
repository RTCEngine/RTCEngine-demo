<style lang="less">
@import './assets/less/reset.less';
@import './assets/less/index.less';
</style>

<template>
  <div id="app">
    <div class="connect-status">
      <p :class="{
        'connecting': connectStatus === 'connecting',
        'connected': connectStatus === 'connected',
        'disconnected': connectStatus === 'disconnected' }">
        {{ connectStatus === 'connecting' ? '连接中...' : connectStatus === 'connected' ? '已连接' : '已断开' }}</p>
    </div>

    <div class="room-link">
      <div class="link-container">
        <a id="room-link" class="link" :data-clipboard-text="invitationLink" href="javascript:void(0);" >invitation link</a>
      </div>
    </div>

    <div class="speaker-container">
      <live-video
        v-if="localStream"
        :stream="localStream"></live-video>
    </div>

    <div class="lestener-container">
      <div
        class="live-video-item"
        v-for="stream in otherStream"
        :key="stream.streamId">
        <live-video :ref="stream.streamId" :stream="stream"></live-video>
      </div>
    </div>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
import { query } from 'mintools'
import { Notification } from 'element-ui'
import { RTCEngine, RTCStream } from 'rtcengine-js-sdk'

import generatesName from './utils/generatesName'

import LiveVideo from './components/LiveVideo'

export default {
  name: 'app',

  data () {
    const roomId = query('roomId')
    return {
      roomId,
      invitationLink: window.location.href,
      username: generatesName(),
      rtcEngine: null,
      localStream: null,
      otherStream: [],
      connectStatus: 'disconnected'
    }
  },

  components: {
    LiveVideo
  },

  created () {
    if (!this.roomId) {
      const roomId = Math.random().toString(36).substr(2)
      window.location.replace(window.location.origin + '?roomId=' + roomId)
    }
  },

  mounted () {
    const oLink = document.getElementById('room-link')
    const clipboard = new Clipboard(oLink)
    clipboard.on('success', () => {
      Notification({ message: '复制成功，可以分享了哦！', position: 'bottom-right', type: 'success', duration: 2500 })
    })

    clipboard.on('error', () => {
      Notification({ message: '复制失败！', position: 'bottom-right', type: 'error', duration: 2500 })
    })
    this.init()
  },

  beforeDestroy () {
    this.rtcEngine.leaveRoom()
  },

  methods: {
    init () {
      this.connectStatus = 'connecting'
      this.rtcEngine = new RTCEngine()
      const localStream = new RTCStream({
        audio: true,
        video: true,
        attributes: { username: this.username }
      })

      /* eslint-disable no-console */
      localStream.setupLocalMedia()
      localStream.addListener('initLocalStream', (stream)=> {
        this.localStream = stream

        stream.addListener('localStreamUpdate', (stream) => {
          console.log('localStream update', stream)
        })
        stream.addListener('shutdownLocalMedia', () => {
          this.localStream = null
          console.log('shutdownLocalMedia')
        })

        this._remoteStreamListener()
      })
    },

    _remoteStreamListener () {
      const appkey = 'http://rtcengine.dot.cc/api/generateToken'
      const appSecret = 'dotcc'
      const room = this.roomId

      this.rtcEngine.addListener('addRemoteStream', (stream) => {
        if (stream.peerId !== this.username) {
          const message = stream.attributes.username + ' join room'
          Notification({ message, position: 'bottom-right', type: 'success', duration: 2500 })
          this.otherStream.push(stream)
          this.otherStream = Object.assign([], this.otherStream)
        }
      })
      this.rtcEngine.addListener('removeRemoteStream', (stream) => {
        const message = stream.attributes.username + ' leave room'
        Notification({ message, position: 'bottom-right', type: 'success', duration: 2500 })
        const index = this.otherStream.findIndex(item => {
          return item.streamId === stream.streamId
        })
        this.otherStream.splice(index, 1)
        this.otherStream = Object.assign([], this.otherStream)
      })

      this.rtcEngine.addListener('muteRemoteVideo',(stream, muted) => {
        this.$refs[stream.streamId].audio = muted
        this.$refs[stream.streamId].currentVolume = 0
      })

      this.rtcEngine.addListener('muteRemoteAudio',(stream, muted) => {
        this.$refs[stream.streamId].video = muted
      })

      this.rtcEngine.addListener('audioLevel', (stream, audioLevel) => {
        console.log('audioLevel ', stream.streamId, audioLevel)
      })

      this.rtcEngine.addListener('state', (state) => {
        console.log('state', state)
        if (state === RTCEngine.CONNECTED) {
          this.dotEngine.addStream(this.localStream)
          const message = 'You are in the room'
          Notification({ message, position: 'bottom-right', type: 'success', duration: 2500 })
        }
        this.connectStatus = (state === RTCEngine.CONNECTED) ? 'connected' : state === RTCEngine.CONNECTING ? 'connecting' : 'disconnected'
      })

      this.rtcEngine.generateTestToken(appkey, appSecret, room, this.username, (error, token) => {
        if (!error) {
          this.rtcEngine.joinRoom(token)
        }
      })
    }
  }
}
</script>
