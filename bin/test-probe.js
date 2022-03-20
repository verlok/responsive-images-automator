import probe from "probe-image-size";
//const imgUrl = "https://via.placeholder.com/350x150";
//const imgUrl = "https://www.dunhill.com/product_image/45634378WS/f/w508_bffffff.jpg";
//const imgUrl = "https://www.henkel.com/resource/image/1610198/16x9/1920/1098/803be6c94a6adfefc53bea6350229de2/DG/laboratory-4-zu-3.jpg";
//const imgUrl = "https://2022.cssday.it/img/speakers/massimo-artizzu.png";
const imgUrl = "https://webpagetest.org/images/wpt_home_featureimg.jpg";
//let result = await probe(imgUrl);
//console.log(result);

probe(imgUrl)
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.error(err);
  });

