# Responsive images automator

<img width="1276" alt="Responsive images automator" src="https://user-images.githubusercontent.com/1127721/161528200-ff6914cf-3712-4a22-a6be-cf532c197b5f.png">

Responsive images automator does 3 main things for you. It:

1. **Extracts data** from your existing images
2. **Generates responsive images tags** for you
3. **Tests** the generated image tags

Here goes some more detailed information.

# 1 - Extract Rendered CSS Widths

<img width="1274" alt="Extract images dimensions from your web pages" src="https://user-images.githubusercontent.com/1127721/161528333-8ea71e39-3c08-4274-86a0-59e939e34e50.png">

In this stage, responsive images automator does:

- **Extract** useful information such as the `width` (in CSS pixels and in `vw` unit) from your pages, at different viewport dimensions (which you can provide)
- **Analyse** the current intrinsic widths with calculated formulas, to help you understand the current level of optimisation of your images.
- **Provide** an easy and intuitive way to select new intrinsic widths to optimise your images

### Configuration files

- `config/resolutions.json` or `config/resolutions.xlsx` (the first found is used). NOTE: If you choose to use the Excel file, there's a specific format to follow, see example in `config/examples/resolutions.xlsx`.
- `config/images.json` or `config/images.xlsx` (the first found is used). NOTE: If you choose to use the Excel file, there's a specific format to follow, see example in `config/examples/webdev/images.xlsx`.
- `config/blacklisted_domains.js`, a list of domains containing blocking scripts that could hinder this tool from navigating around freely.
- `config/blacklisted_paths.js`, a list of paths to blocking scripts on your own domain that could hinder this tool from navigating around freely.

### Execution

After installing all dependencies with `npm install`, just run the following command in your terminal.

```
npm run extract
```

A magically driven browser window will appear, doing all what was promised in the previous lines.

### Output

Find the extracted data in `/data/datafile.xlsx`, one worksheet per row of the images config file.

## Analyse Extracted Data

In the columns of the extracted file, you will find:

| Column name                | Meaning                                                                                                                                                                                                                                                                 |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `current` `Intrinsic` `Width`    | The current intrinsic width, meaning the width of the downloaded images                                                                                                                                                                                                 |
| `current` `Rendered` `Fidelity`  | The current rendered fidelity (pixel ratio), meaning the ratio between the downloaded image width and the rendered width in CSS pixel                                                                                                                                   |
| `current` `RTI` `Fidelity` `Ratio`  | The current rendered-to-ideal fidelity ratio, meaning the ratio between the ideal fidelity ratio and the current fidelity ratio. In other words, the ideal value to find here would be 1                                                                                |
| `current` `Evaluation`        | The evaluation of the current image intrinsic width, from BIG to POOR. It is ideal to get an `OK` here, but also a `(+)` or a `(-)` are acceptable                                                                                                                      |
| `current` `Waste`             | This tells you how much you are wasting, in percentage. This value considers the `currentRTIFidelityRatio` AND the `usage`, so the wider the usage, the bigger the waste                                                                                                |
| `ideal` `Intrinsic` `Width`      | The calculation of the ideal intrinsic width you would have to use to get an `OK` evaluation                                                                                                                                                                            |
| **`chosen` `Intrinsic` `Width`** | **The proposed intrinsic width. You can and should change this value. This value will be used to generate the HTML of your responsive images**                                                                                                                          |
| `chosen` `Rendered` `Fidelity`   | The chosen rendered fidelity (pixel ratio), meaning the ratio between the width of image that would be downloaded and the rendered width in CSS pixel                                                                                                                   |
| `chosen` `RTI` `Fidelity` `Ratio`   | The chosen rendered-to-ideal fidelity ratio, meaning the ratio between the ideal fidelity ratio and the chosen fidelity ratio. You should try to get a value as close as possible to 1 in this cell                                                                     |
| `chosen` `Evaluation`         | The evaluation of the chosen intrinsic width, from BIG to POOR. You should try to get an `OK` here, but also a `(+)` or a `(-)` are acceptable. You should act if you find a `BIG` or `POOR` evaluation and the resolution is used enough to generate significant waste |
| `chosen` `Waste`              | This calculates how much you would be wasting, in percentage, with the chosen numbers. This value considers the `chosenRTIFidelityRatio` AND the `usage`, so the wider the usage, the bigger the waste                                                                  |

## Time To Optimise!

This is where you, human, come into play. 
You have to decide which intrinsic widths you want to use, with the help of the suggestion in the `IdealIntrinsicWidth` column, and change the values in the `ChosenIntrinsicWidth` column, taking into account the values ​​generated by the magic formulas in the columns on the far right.
When you are done, save the file.

**Don't panic!** Here are the steps you need to follow.

### A - Open the data file

Open extracted data (`/data/datafile.xlsx`) in Excel.

### B - Define intrinsic widths

You'll need to define ideal images' intrinsic widths in order to have a few (5 or 6) final image dimensions and minimise waste.

The magic formulas in the rightmost columns of the spreadsheet will guide you.

Adjust `chosenIntrinsicWidth` where you see "POOR" or "BIG" indications in the `chosenEvaluation` column. You want to accept a "BIG" on rarely used resolutions, e.g. 320@2x.

Now check: do you have similar `chosenIntrinsicWidth` values? If you do, group them by using one of the similar values. It is generally a good idea to use the one that corresponds to the most used resolution.

### C - (Optional) Polish VW

If you have different but similar values in the `imgVW` column, it's a good idea to group them to get lighter HTML code and the same result. E.g. if you have `vw` values like `39`, `40`, `41`, you should probably set them all to `40`.

### D - Repeat for each worksheet

Do the above steps for each of the worksheets. In case you don't know, worksheets are the Excel tabs below the cells

### E - (Optional) Multiple pages refinement

Reusing the same dimensions across pages will leverage CDN cache and browser cache for all of your users.

So check: do you have similar `chosenIntrinsicWidth` values ACROSS PAGES?

If you do have similar `chosenIntrinsicWidth` values, group them by using one of the similar values and repeat the process.

---

**Love this project? 😍 [Buy me a coffee!](https://ko-fi.com/verlok)**

---

# 2 - Generate Image Tags

<img width="1276" alt="Generates HTML code for responsive images" src="https://user-images.githubusercontent.com/1127721/161528489-f3b153ef-da59-409c-b398-2f8f0dd17029.png">

In this stage, responsive images automator does:

- **Spin up** an HTTP server
- **Generate the HTML** for every image using the data we have in the `data/datafile.xslx` in the configuration file

### Execution

After installing all dependencies with `npm install`, just run the following command in your terminal.

```
npm run start
```

This will launch the server and output a list of the URLs you can visit, like the following:

```
http://localhost:8080/image/{{imageName}}/
```

...with `{{imageName}}` being the name you used in `config/images.xlsx`.

When the page will be loaded by the browser, an image will be rendered in it. 

Under the rendered image, find the generated HTML code.

---

**Love this project? 😍 [Buy me a coffee!](https://ko-fi.com/verlok)**

---

# 3 - Test Generated Image Tags

<img width="1277" alt="Makes sure browsers download the correct image" src="https://user-images.githubusercontent.com/1127721/161528572-d5b57969-159a-4153-b4da-eac25778784f.png">

In this stage, responsive images automator does:

- **Generate the tests** files you need
- **Test the generated tag** to effectively check if browsers download the images of the intrinsic width you selected.

### Execution

After installing all dependencies with `npm install`, just run the following command in your terminal.

To generate test files, run the command:

```
npm run build:tests
```

While the server is running in another terminal window (see `npm run start` above), run:

```zsh
npm run test
```

This will open an invisible browser and make sure that, at different resolutions, the downloaded image is always the one you intended.

### Something is red?

Tests are made to understand if you made mistakes and change things accordingly. 

If some test returned a red statement, read it carefully and try to understand why your browser downloaded a differnt image at that specific resolution.

If you aren't able to understand, you could open an issue and request for advice. I can't guarantee how quick I will reply, but I will reply at some point.

---

**Love this project? 😍 [Buy me a coffee!](https://ko-fi.com/verlok)**

---

### Something is broken?

If you found errors in this tool, please open an issue and report it to me. Thanks!

---

**Love this project? 😍 [Buy me a coffee!](https://ko-fi.com/verlok)**

---

## Conference Talks About This Tool

I talked about this tool at [CSS Day IT conference 2022](https://2022.cssday.it/schedule/). [In this blog post](https://www.andreaverlicchi.eu/css-day-2022-talk-automating-responsive-images-automator-ottimizzazione-immagini-4-0/) you will find the slides and the video of that talk.
