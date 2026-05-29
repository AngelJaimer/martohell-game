// `base` controls the URL the build is served from.
//   - Local dev + a user/root domain: leave it as '/'.
//   - GitHub Pages PROJECT site (https://user.github.io/<repo>/):
//     build with  BASE_PATH=/<repo>/ npm run build
//     (the deploy workflow sets this for you).
export default ({ command }: { command: string }) => ({
  base: command === 'build' ? (process.env.BASE_PATH || '/') : '/',
  server: { host: true, open: false },
});
