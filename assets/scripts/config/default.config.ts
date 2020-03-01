
export default {
  /**
   * Server Request Config
   */
  server: {
    // host: 'https://io.slmblog.com',
    host: 'http://127.0.0.1:7100',
    devHost: 'http://127.0.0.1:7100',
    // devHost: 'https://io.slmblog.com',
    children: {},
  },
  /**
   * Socket.io Port Conifg
   */
  io: {
    // main: 'https://io.slmblog.com',
    main: 'http://127.0.0.1:7100',
  },
}