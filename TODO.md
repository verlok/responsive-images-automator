# TO DO


## VERSION 2

Fix HTML code generation.
Make tests turn green again.


## VERSION 3

Add `npm build:tests` to generate JEST files starting from the Excel data file.

---

Un-wire that 414, 375@3x from extraction and calculate it using resolutions data and usage (414@2x is currently the wider & most-used smartphone, 375@3x is the most used)

---

Automate all the logic that is now in charge of the final user with the help of Excel formulas.
Find the algorithm while doing it manually and transform it into code.

Automatically round `vw` to `10vw` or amongst groups of `10vw`, instead of asking users to do it manually.

---

Add `npm build` to generate image tags (or pages and image tags?) in static files, for easier copy and paste and easier testing. 
Express.js would be used only by JEST for testing purposes.

---

Support adaptive websites (separate versions for smartphone + desktop|tablet), e.g. by adding the ability to set a cookie to force the version, or enabling emulation mode in puppeteer.


## COMMS

- Update the slides on the new talk
- Write a blog post on this
- Record a video on how to do that
- Tweet!