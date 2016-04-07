> Work in Progress! Currently unreleased.

# Snowman Style Guide Generator

This is a fun, simple, and easy to use **fully automatic** living style guide generator that uses your real live source code to generate a style guide.

Official website: [https://snowman.io](https://snowman.io)

## Use Case

The industry has heavily pushed towards reusable, scalable, modular **design patterns** in recent years. This involves developing systems using CSS that can be applied to the various building blocks that make up our web pages. A great way of demoing such a system is with a living style guide. The idea is that instead of having high-fidelity mockups for each page, or even part of a page, you instead have a mini-website (think the Bootstrap docs) where you can see all the components that make up your website, as well as documentation on how to modify them and what markup to use to make them look like that. That mini-site can be updated and maintained so that it always reflects the current state of your website.

The **problem** with this idea is that it's a lot of work to maintain. You don't want to have to ever update the same code in 2 or more places. It would be great if a style guide could be **automatically** generated from your real source code! There are already many tools to help with this:

* [Style Guide Generator Roundup · An A List Apart Blog Post](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=0ahUKEwjovI6ipPzLAhVS2WMKHc4IAHIQFggcMAA&url=http%3A%2F%2Falistapart.com%2Fblog%2Fpost%2Fstyle-guide-generator-roundup&usg=AFQjCNFpOLOaMpMN_X0xksPQsDZvsACzrQ&sig2=gP7j2SM6KH25aTAlD5HRVA&bvm=bv.118817766,d.cGc)
* [Styleguide Generator Roundup | Welch Canavan](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=2&cad=rja&uact=8&ved=0ahUKEwjovI6ipPzLAhVS2WMKHc4IAHIQFggkMAE&url=http%3A%2F%2Fwelchcanavan.com%2Fstyleguide-roundup%2F&usg=AFQjCNG51xQuKsX6GsPkxODOVIDGiN9WhQ&sig2=_wmM3BaOthxwNfjSnHyZzg&bvm=bv.118817766,d.cGc)
* [GitHub - davidhund/styleguide-generators](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=3&cad=rja&uact=8&ved=0ahUKEwjovI6ipPzLAhVS2WMKHc4IAHIQFggqMAI&url=https%3A%2F%2Fgithub.com%2Fdavidhund%2Fstyleguide-generators&usg=AFQjCNEj5c-YBbFTkkBg6Ro-SpLBUxPZ2A&sig2=2dvC9W7W9c7kqmJ15QlT8Q&bvm=bv.118817766,d.cGc)

Most of these solutions involve a certain style of documentation in your CSS, paired with a style guide template file. They may work as a plugin for your favourite build tool to parse your CSS and generate a style guide using your template. Brilliant!

However, we all have different build tools. We all like to use different flavours of HTML template engines and CSS preprocessors. We all organise our files and folders differently. I have found none of these tools currently available to be entirely versatile, or otherwise take a lot of complicated setup to get working. Nor have I found any style guide generators that remove the need to ever have to copy and paste or duplicate code, especially the markup. That's why I made Snowman - fully automated living style guides for everyone.

## Features

### Style Documentation Where it Belongs

Your styles are in your CSS so that's where your documentation goes. Whether you use LESS, SASS, Stylus, or “vanilla” CSS, just include a documentation block above the styles for each component:

```
// @name Component
// @description This is a component
// @states
// Hovered - .c-component:hover - When the component is hovered
// Focused - .c-component:focus - When the component is focused
// @variants
// Big - .c-component--big - A big version of the component
// @markup ../html/components/component.html

.c-component {
	property: declaration;
}
.c-component:hover {
	property: declaration;
}
.c-component--big {
	font-size: 2em;
}
.
.
.
```

* **Name**: The name of the component (required). This will be used as a subheading for the section or page demonstrating the component on the style guide.
* **Description**: A short (optional) line of text that will be displayed beneath the subheading on the style guide.
* **States**: For each line listed below @states (optional) you may describe a state that the component may be in (e.g. :hover, :active, :focus, .is-active, .has-something, etc.). First write the name of the state, then a hyphen, then the selector or pseudo-selector that defines the state, then another hyphen, then a description of that state. For each state, a demonstration will be output to the style guide, along with the state's name, selector, and description.
* **Variants**: For each line listed below @variants (optional) you may describe a variant of the component (e.g. --big, --primary etc.). First write the name of the variant, then a hyphen, then the selector that defines the variant, then another hyphen, then a description of that variant. For each variant, a demonstration will be output to the style guide, along with the variant's name, selector, and description.
* **Markup**: A relative path to the file containing the markup for the corresponding component (required). This file may also contain other components and may contain variables to be parsed by the templating engine.

### No Markup Duplication

By referencing a path to the markup for each style block you can ensure that the markup being used is the latest version, the same as the markup being used in the production or your website. There is no need to copy and paste markup into the CSS documentation.

In your Snowman configuration file, you need to specify if you are using a templating engine for your markup. That way Snowman knows how to handle things like variable interpolation and inline JavaScript that you may need to use in your templates.

The only downside to handling markup snippets this way is that it is removed from the styles - you need to open another file side by side in order to reference the markup when writing styles. However, you still have the file path, and I think this is a small price to pay for no duplication of markup.

### Automatic Style Guide Generation

Snowman will parse all your CSS looking for these documentation blocks. It will then use your style guide templates to build a page, or series of pages, that demonstrate and describe all of the components on your site, including any different states or variants of each component. You have the option of whether your style guide be single page or multi-page, and also whether to have the markup displayed on your style guide in plain HTML or in your templating language of choice (depending on which your project's designer(s) and developer(s) would prefer to reference).

### Versatility

You can choose:

* Which CSS files the documentation is drawn from
* The location of your corresponding HTML templates for each component
* The location of your style guide templates
* The look & feel and behaviour of your style guide
* The location of your generated style guide
* Which flavour of HTML and CSS you want to use
* Which build system you want to use
* Your own project folder structure

### Easy Setup & configuration

All configuration options are specified in a configuration file that's automatically generated for you.

## Requirements & Installation Instructions

You'll need Node & NPM.

To install Snowman globally:

```
sudo npm install -g snowman
```

Or to install it locally in your project:

```
npm install --save-dev snowman
```

## Setup Instructions

To automatically generate a configuration file, in the root folder of your project run:

```
snowman init
```

This will ask you a few questions about your setup and then place a file `snowman.config.js` in the root folder of your project. This configuration file contains documentation in case you need to modify it in any way. It will also optionally generate the style guide template files for you.

> Snowman will not work without a valid configuration file.

If you did not opt for style guide template files to be automatically generated, you will need to create 3 files:

* **index.html**: The main template file for your style guide. This should contain (a) link(s) to your main project CSS style sheet(s), javascript file(s), and also references to where the navigation and style guide content should appear in your template. These references appear as such: `{{navigation}}`, `{{content}}`.
* **component.html**: This will be used as a template for generating the part of the guide that corresponds to each of the documentation blocks in your CSS. It will describe and demonstrate each component in your site.
* **navigation.html**: This is a menu that will allow users of your style guide to navigate to pages or sections for each component.

> Check the examples or the automatically generated style guide template files for more documentation about how they can be modified.

> You may also want to create your own CSS style sheet or JavaScript file for your style guide, which can be linked to from your style guide template index.html file.

That's it!

### Build System Plugins

* Grunt plugin: []()
* Gulp plugin: []()
* Webpack loader: []()

## Examples

In the `demo` folder you'll find an example project using various setups, including Grunt, gulp, webpack, make, and npm scripts. It also has examples for HTML, Haml, Jade, CSS, LESS, SASS, and Stylus.

## Compatibility

Tested on Mac OS using:
* Grunt
* Gulp
* Webpack
* HTML
* HAML
* Jade
* CSS
* LESS
* SASS
* Stylus

More to come later. It should theoretically work with any flavour of CSS, although markup templating can be tricky.

## Roadmap

* More templating languages
* A style guide theming system & themes repository

## Contributing

I'll happily accept feedback, comments, and of course pull requests. Please use the Github issue tracker for reporting bugs and send any feedback to [snowman@yourweb.expert](mailto:snowman@yourweb.expert)

## Author

Made with &hearts; by [Darryl Snow](https://yourweb.expert).<br>
[@dazsnow](https://www.twitter.com/dazsnow)