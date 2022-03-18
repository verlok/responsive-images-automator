# Responsive images automator

This tool is useful to:

1. extract rendered CSS width from your pages
2. generate the image tags (after you added intrinsic width to your data)
3. test the generated image tags


## EXTRACT RENDERED CSS WIDTHS

Extract images `width` in CSS pixels and in `vw` unit from pages, using puppeteer.

### required config 

- `config/resolutions.csv`
- `config/extraction.csv`
- `config/blacklisted_domains.js`
- `config/blacklisted_paths.js`

### command 

`npm run extract`

### output
 
Find the extracted data in `/data/datafile-extracted.xlsx`, one worksheet per row of the extraction page.


## ADD INTRINSIC WIDTHS

Defining the intrinsic width of the images would be your only manual step. 
Don't panic, we got your back.

### PREPARE THE CANVAS

- Open extracted data (`/data/datafile-extracted.xlsx`) in Excel
- Save it with file name (`/data/datafile.xlsx`)

### DEFINE INTRINSIC WIDTHS

You'll need to define ideal images' intrinsic widths in order to have a few (5 or 6) final image dimensions and minimise waste.

The magic formulas in the rightmost columns of the spreadsheet will guide you.

Adjust `intrinsicWidth` where you see "POOR" or "BIG" indications in the `isOK` column. You want to accept a "BIG" on rarely used resolutions, e.g. 320@2x.

Now check: do you have similar `intrinsicWidth` values? If you do, group them by using one of the similar values. It is generally a good idea to use the one that corresponds to the most used resolution. Do that and check again the `isOK` column and adjust where needed.

### POLISH VW

In the Uncapped Images Page data, it's important to group together similar values of the `imgVW` column. So if you have values like `39`, `40`, `41`, you can probably set them all to `40`. This will allow the tag-generation script to generate ligher HTML code for the same results.

### REPEAT FOR EACH WORKSHEET

Do the above steps for each of the worksheets (Excel tabs).


### MULTIPLE PAGES REFINEMENT

Reusing the same dimensions across pages will leverage CDN cache and browser cache for all of your users.

So check again: do you have similar `intrinsicWidth` values ACROSS PAGES?

To check this, copy all the `intrinsicWidth` from the listing page and uncapped images page in a new sheet, sort the values and remove the duplicates. Calculate the delta between each of the widths, it's usually a bad practice to have deltas < 100 pixels.

If you do have similar `intrinsicWidth` values, group them by using one of the similar values and repeat the process. 

This new sheet will also give you a list of all the dimensions (widths) as an outcome, to pass as a config to your image processing tool.


## GENERATE IMAGE TAGS

Launch the server and visit pages to get the image tags you'd need.

`npm run start`

You can visit the pages at the URL

```
http://localhost:8080/page/{{ pagename }}/
```

`{{ pagename }}` being the name you used in `config/extraction.csv`

Use developer tools to inspect the images, right-click, copy outerHtml


## TEST GENERATED IMAGE TAGS

Test the generated tag to understand if browsers will download images of the intrinsic width you selected.
 
### required step

`npm run start`
`npm run start:dev` for auto-reload with nodemon

### required config

- `views/__tests__/uncapped.ejs.test.js`
- `views/__tests__/capped.ejs.test.js`

### test (in another terminal window)

`npm run test`
`npm run test:dev` for watch mode


## 🆘 HELP?

- [This talk slides](https://docs.google.com/presentation/d/1O_BQ0KuDTNV2WRryEJlmcyMiHNlVK4802K88PdrVEeo/edit?usp=sharing) go through the process
- Check out this (COMING SOON) video see the process in action!