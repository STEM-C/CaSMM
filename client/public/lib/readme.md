## About This Directory  
This directory is used to store the libraries being used for this web app. Notably, the [ArduBlockly](https://github.com/carlosperate/ardublockly) library, which relies on Google's [Blockly](https://github.com/google/blockly) library. The files are referenced in `index.html`.  

These compressed files are generated with ArduBlockly's build script. Since ArduBlockly have ended development since 2018, we've made our own branch of ArduBlockly, as seen [here](https://github.com/STEM-C/ardublockly), where we've made bug fixes and added additional support for different blocks.

Details about building the compressed files and adding to our ArduBlockly library can be seen [here](https://github.com/STEM-C/ardublockly/wiki/Working-with-the-ArduBlockly-Library).

## depreciated.js
Inside this file, depreciated code from google's closure library can be found.  

The Blockly library that ArduBlockly is based off of makes use of Google's closure library. During the build process, the most recent version of the closure library is pulled. Since the original ArduBlockly ended development in 2018, and the version of Blockly that it's based off of came from 2016, a number of elements in the codebase have been depreciated according to Google's code base.  

By keeping these depreciated code in this file, we ensure that our version of Blockly continues to function.