# TO DO

## CURRENT VERSION

`npm run extract` exports also current intrinsic widths with calculated formulas, to help you understand the current level of optimisation of your images.

BUG: fix tests, they're now using old column names

BUG: under some circumstances images get stuck in HTTP connection (e.g. YNAP images), make sure either you can disable intrinsic widths extractions

## NEXT VERSIONS

Add a new Excel sheet with formulas to help users find unique intrinsic image widths.
It should be `UNIQUE(TOCOL(A2:B12))`.

---

Find a way to run tests based on an extraction of requirements form the Excel data file. Started on branch `feature/dynamic-tests`.

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