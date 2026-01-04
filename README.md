# Odin Build Template

This repository serves as a build template for new projects. It is preconfigured with modern tools to ensure a smooth development workflow and high code quality. The template leverages **Webpack** for bundling, **ESLint** for code linting, and **Prettier** for code formatting.

## Features

- **Webpack Build System:**  
  Uses Webpack with ES Modules for both development and production builds. Paths are reliably resolved using `__dirname` (as an equivalent for ES Modules), ensuring that the build works regardless of the working directory.

- **ESLint Integration:**  
  Code linting is enabled by default, helping catch issues early and maintain consistency throughout code.

- **Prettier Integration:**  
  Automatically formats code to a consistent style, reducing friction during development and code reviews.

- **Minimal CSS Reset:**  
  The included CSS file applies a minimal CSS reset to create a consistent styling baseline across browsers.

- **Template Files:**  
  The `src` folder contains:
    - A sample JavaScript file (`index.js`) serving as the entry point.
    - A sample HTML file (`template.html`) to serve as your main HTML template.
    - A stylesheet (`styles.css`) that includes a basic CSS reset.

## Odin Assignment Reference

For more details on how ESLint and Prettier work together to enforce code quality and style, see the Odin assignment documentation: [The Odin Project – ESLint and Prettier Assignment](https://www.theodinproject.com/lessons/node-path-javascript-linting)
