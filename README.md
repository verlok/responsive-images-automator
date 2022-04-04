# Responsive images automator

<img width="1276" alt="Responsive images automator" src="https://user-images.githubusercontent.com/1127721/161528200-ff6914cf-3712-4a22-a6be-cf532c197b5f.png">

This tool is useful to:

1. extract rendered CSS width from your pages
2. generate the image tags (after you added intrinsic width to your data)
3. test the generated image tags

## TALK

I [talked about this tool](https://www.andreaverlicchi.eu/css-day-2022-talk-automating-responsive-images-automator-ottimizzazione-immagini-4-0/) at CSS Day conference in 2022. Follow the link to see slides and video.

## EXTRACT RENDERED CSS WIDTHS

<img width="1274" alt="Extract images dimensions from your web pages" src="https://user-images.githubusercontent.com/1127721/161528333-8ea71e39-3c08-4274-86a0-59e939e34e50.png">

Extract images `width` in CSS pixels and in `vw` unit from pages, using puppeteer.

### Config

- `config/resolutions.csv`
- `config/extraction.csv`
- `config/blacklisted_domains.js`
- `config/blacklisted_paths.js`

### Command

`npm run extract`

### Output

Find the extracted data in `/data/datafile.xlsx`, one worksheet per row of the extraction page.

## ANALYSE AND IMPROVE INTRINSIC WIDTHS

In the columns, find:

| Column name             | Meaning                                                                            |
| ----------------------- | ---------------------------------------------------------------------------------- |
| currentIntrinsicWidth   | The current width of the downloaded images                                         |
| currentRenderedFidelity | The currently rendered fidelity (pixel ratio)                                      |
| currentRTIFidelityRatio | The current rendered-to-ideal fidelity ratio, which ideal number is 1              |
| currentEvaluation       | The evaluation of the current image intrinsic width, from BIG to POOR. Ideal is OK |
| currentWaste            | How much you are wasting, in percentage. Considers how much the resolution is used |
| idealIntrinsicWidth     | The ideal intrinsic width you would have to use                                    |
| chosenIntrinsicWidth    | The intrinsic with you choose, to generate the HTML of your responsive images      |
| chosenRenderedFidelity  | The chosen rendered fidelity (pixel ratio)                                         |
| chosenRTIFidelityRatio  | The chosen rendered-to-ideal fidelity ratio, which ideal number is 1               |
| chosenEvaluation        | The evaluation of the chosen image intrinsic width, from BIG to POOR. Ideal is OK  |
| chosenWaste             | How much you would waste, in percentage. Considers how much the resolution is used |

Defining the intrinsic width of the images would be your only manual step.
Don't panic, we got your back.

### Open the data file

Open extracted data (`/data/datafile.xlsx`) in Excel.

### Define intrinsic widths

You'll need to define ideal images' intrinsic widths in order to have a few (5 or 6) final image dimensions and minimise waste.

The magic formulas in the rightmost columns of the spreadsheet will guide you.

Adjust `chosenIntrinsicWidth` where you see "POOR" or "BIG" indications in the `chosenEvaluation` column. You want to accept a "BIG" on rarely used resolutions, e.g. 320@2x.

Now check: do you have similar `chosenIntrinsicWidth` values? If you do, group them by using one of the similar values. It is generally a good idea to use the one that corresponds to the most used resolution. Do that and check again the `isOK` column and adjust where needed.

### Polish VW

In the Uncapped Images Page data, it's important to group together similar values of the `imgVW` column. So if you have values like `39`, `40`, `41`, you can probably set them all to `40`. This will allow the tag-generation script to generate ligher HTML code for the same results.

### Repeat for each worksheet

Do the above steps for each of the worksheets (Excel tabs).

### Multiple pages refinement

Reusing the same dimensions across pages will leverage CDN cache and browser cache for all of your users.

So check again: do you have similar `chosenIntrinsicWidth` values ACROSS PAGES?

To check this, copy all the `chosenIntrinsicWidth` from the listing page and uncapped images page in a new sheet, sort the values and remove the duplicates. Calculate the delta between each of the widths, it's usually a bad practice to have deltas < 100 pixels.

If you do have similar `chosenIntrinsicWidth` values, group them by using one of the similar values and repeat the process.

This new sheet will also give you a list of all the dimensions (widths) as an outcome, to pass as a config to your image processing tool.

## GENERATE IMAGE TAGS

<img width="1276" alt="Generates HTML code for responsive images" src="https://user-images.githubusercontent.com/1127721/161528489-f3b153ef-da59-409c-b398-2f8f0dd17029.png">

Launch the server and visit pages to get the image tags you'd need.

```zsh
npm run start
```

You can visit the pages at the URLs that will be displayed in the terminal.

```
http://localhost:8080/page/{{ pagename }}/
```

With `{{ pagename }}` being the name you used in `config/extraction.csv`

Use developer tools to inspect the images, right-click, copy outerHtml.

## TEST GENERATED IMAGE TAGS

<img width="1277" alt="Makes sure browsers download the correct image" src="https://user-images.githubusercontent.com/1127721/161528572-d5b57969-159a-4153-b4da-eac25778784f.png">

Test the generated tag to understand if browsers will download images of the intrinsic width you selected.

### Command

```zsh
npm run start
```

or, for auto-reload during development:

```zsh
npm run start:dev
```

### Test files

- `views/__tests__/uncapped.ejs.test.js`
- `views/__tests__/capped.ejs.test.js`

### Test (in another terminal window)

```zsh
npm run test
```

or, for watch mode during development:

```zsh
npm run test:dev
```

## 🆘 HELP?

- [This talk slides](https://docs.google.com/presentation/d/1O_BQ0KuDTNV2WRryEJlmcyMiHNlVK4802K88PdrVEeo/edit?usp=sharing) go through the process
- Check out this (COMING SOON) video see the process in action!
