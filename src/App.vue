<style lang="less">
@import './assets/less/reset.less';
@import './assets/less/index.less';
@import './assets/less/fontello.less';
</style>

<template>
  <div id="app">
    <div class="connection-status">
      <span
        class="connection-icon"
        :class="{
          'connected': connectStatus === 'connected',
          'connecting': connectStatus === 'connecting',
          'disconnected': connectStatus === 'disconnected'
        }"></span>
      <p class="connection-text">{{ connectStatus.toUpperCase() }}</p>
    </div>

    <div class="room-link">
      <div class="link-container">
        <a id="room-link" class="link" :data-clipboard-text="invitationLink" href="javascript:void(0);" >invitation link</a>
      </div>
    </div>

    <div class="speaker-container">
      <live-video
        v-if="localStream"
        :stream="localStream"
        :oneself="true"></live-video>
    </div>

    <div class="lestener-container">
      <div
        class="live-video-item"
        v-for="stream in otherStream"
        :key="stream.streamId">
        <live-video :stream="stream"></live-video>
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
      /* eslint-disable no-console */
      this.rtcEngine = new RTCEngine()
      this._localStreamListener()
      this._remoteStreamListener()

      this.connectStatus = 'connecting'
      const appkey = 'http://rtcengine.dot.cc/api/generateToken'
      const appSecret = 'dotcc'
      const room = this.roomId
      this.rtcEngine.generateTestToken(appkey, appSecret, room, this.username, (error, token) => {
        if (!error) {
          this.rtcEngine.joinRoom(token)
        }
      })
    },

    _localStreamListener () {
      const localStream = new RTCStream({
        audio: true,
        video: true,
        attributes: { username: this.username }
      })

      localStream.setupLocalMedia()
      localStream.addListener('initLocalStream', (stream)=> {
        this.localStream = stream
        const message = 'You are in the room'
        Notification({ message, position: 'bottom-right', type: 'success', duration: 2500 })

        stream.addListener('localStreamUpdate', () => {
          console.log('localStream update')
        })

        stream.addListener('shutdownLocalMedia', () => {
          console.log('shutdownLocalMedia')
        })
      })
    },

    _remoteStreamListener () {
      this.rtcEngine.addListener('addRemoteStream', (stream) => {
        console.log('addRemoteStream', stream)
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

      this.rtcEngine.addListener('audioLevel', (stream, audioLevel) => {
        console.log('audioLevel ', stream.streamId, audioLevel)
      })

      this.rtcEngine.addListener('state', (state) => {
        if (state === RTCEngine.CONNECTED) {
          this.rtcEngine.addStream(this.localStream)
        }
        this.connectStatus = (state === RTCEngine.CONNECTED) ? 'connected' : state === RTCEngine.CONNECTING ? 'connecting' : 'disconnected'
      })
    }
  }
}
</script>
