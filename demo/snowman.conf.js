module.exports = function(config) {

  config.set({

    /**
     * The location of the CSS files containing the documentation from which
     * the style guide will be generated. Glob format is ok, or you can list
     * specific individual files.
     */
    css: ['./src/css/**/*.css'],

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
      src: '/',
      dest: '/dist/styleguide',
      singlePage: true
    },

    /**
     * The template engine to be used for the markup. Can be blank or can otherwise
     * be "jade" or "haml".
     */
    templateEngine: ""

  });

}