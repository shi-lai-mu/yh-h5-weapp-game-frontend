
export default {
  /**
   * Server Request Config
   */
  server: {
    host: 'https://io.slmblog.com',
    devHost: 'http://127.0.0.1:7100',
    children: {},
  },
  /**
   * Socket.io Port Conifg
   */
  io: {
    main: 'https://io.slmblog.com',
    dev: {
      main: 'http://127.0.0.1:7100',
    },
  },
}