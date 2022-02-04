IMMEDIATE

- 3rd part: testing. Test specs must be defined and written starting from the CSV data files. Try and document.
- Test and streamline the process, while...
  - Updating docs in the README
  - Taking screenshots for the slides and the guide (for the readme)

COMMS

- Update the slides on the new talk
- Write a blog post on this
- Record a video on how to do that
- Tweet!

FUTURE PLANS

- Un-wire that 414@2x, 375@3x from extraction and calculate it using resolutions data and usage (414@2x is currently the wider & most-used smartphone, 375@3x is the most used)
Either:
  - Generate an Excel file with the additinal colums' formulas, instead of a "static" CSV file
  - Automate all the logic that are actually inside the formulas (mind-blowing?)
- Add statically generated pages and tags, for easier copy and paste and easier testing. Express.js would be used only by jest for testing purposes.
- Support adaptive websites (smartphone + desktop|tablet), e.g. by adding the ability to set a user agent for each extraction || a cookie to force the version.
- Automatically round `vw` to `10vw` or amongst groups of `10vw`, instead of asking users to do it manually.