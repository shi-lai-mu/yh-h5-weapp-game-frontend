
export default {
  /**
   * Server Request Config
   */
  server: {
    host: 'http://127.0.0.1:7100',
    devHost: 'http://127.0.0.1:7100',
    children: {},
  },
  /**
   * Socket.io Port Conifg
   */
  io: {
    main: 'ws://127.0.0.1:7100',
  },
}