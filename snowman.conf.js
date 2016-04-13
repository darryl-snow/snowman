// Snowman configuration
// Generated on Wed Apr 13 2016 16:49:12 GMT+0800 (CST)

module.exports = function(config) {

  config.set({

    /**
     * The location of the CSS files containing the documentation from which
     * the style guide will be generated. Glob format is ok, or you can list
     * specific individual files.
     */
    css: [
      './src/css/**',
      './src/lib/css/**'],

    /**
     * Configuration options for the style guide itself.
     *
     * @src           The folder where the style guide template(s) are located - you
     *                MUST have an index.html file, a component.html file, and a
     *                navigation.html file!
     * @dest          The folder where the generated style guide should be placed
     * @compiledHTML  If true then the markup displayed on the style guide will be
     * 								compiled HTML, rather than Jade or Haml
     * @singlePage    If false then a new page will be generated for each component
     * 								(this might be useful if you have so many components that it
     * 							 	will affect the performance of a single page, or if you want
     * 							 	to be able to demonstrate components in isolation)
     */
    styleguide: {
      src: '/css/styleguide',
      dest: '/public/styles',
      singlePage: true
    }

  });

}