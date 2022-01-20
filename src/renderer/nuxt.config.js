/**
 * By default, Nuxt.js is configured to cover most use cases.
 * This default configuration can be overwritten in this file
 * @link {https://nuxtjs.org/guide/configuration/}
 */

module.exports = {
  ssr: false,
  target: "static",
  head: {
    title: "TimeKeeper",
    meta: [{ charset: "utf-8" }]
  },
  loading: false,
  css: [
    "~/assets/styles/css/style.css",
    "~/assets/icons/remixicon/remixicon.css",
    "~/assets/styles/css/tailwind.css"
  ],
  plugins: ["@/plugins/vue-ellipse-progress", "~/plugins/route"],
  buildModules: ["@nuxt/typescript-build", "@nuxtjs/tailwindcss"],
  modules: ["@nuxtjs/auth-next", "@nuxtjs/style-resources"],
  tailwindcss: {
    cssPath: "~/assets/styles/css/tailwind.css",
    configPath: "tailwind.config.js",
    exposeConfig: false,
    config: {}
  },
  //You will have to add this new object if it doesn't exist already
  styleResources: {
    scss: ["./assets/scss/*.scss"]
  },

  build: {
    extend(config, ctx) {
      config.module.rules.push({
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]"
        }
      });
    }
  }
};
