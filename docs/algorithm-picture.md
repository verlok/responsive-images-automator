# Algorithm to generate the picture tag

- PREREQUISITE: Sort all rows by screen width, then by pixel ratio
- Read "intrinsic width" until it changes
- The previously unvaried "intrinsic width" `[A]` goes in the image tag @ 2x => `<img src="__" srcset="[A] 2x">`
- Create a new `<source>` tag
    - In the `<source>`'s `media` attribute use the new "screen width" value `[B]` => `media="(min-width: [B]px)`
    - While the map of "intrinsic width"s for 1x pxr and 2x pxr `[C]` doesn't change 
    - In the `<source>`'s `srcset` attribute media, use the previously unvaried map of "intrinsic width"
- You should use the first image in the `<img>`'s `src` attribute, which is for legacy browsers (IE) only

(loop until the table ends)

```html
<picture>
    <source media="(min-width: [B])" srcset="[C] 1x, [C] 2x">
    <img src="[IE]" srcset="[A] 2x">
</picture>
```