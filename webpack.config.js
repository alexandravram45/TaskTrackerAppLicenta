const path = require("path");
module.exports = {
  entry: "./src/index.jsx", // Entry point of your application
  output: {
    filename: "bundle.js", // Output bundle file name
    path: path.resolve(__dirname, "dist"), // Output directory
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
    exports: {
        devServer: {
            client: {
              overlay: {
                runtimeErrors: (error) => {
                  if (error.message === 'ResizeObserver loop limit exceeded') {
                    return false;
                  }
                  return true;
                },
              },
            },
          },
    }
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  devServer: {
    contentBase: path.join(__dirname, "public"), // Serve files from this directory
    port: 3000, // Port for the development server
    open: true, // Open the default web browser when the server starts
  },
  
}