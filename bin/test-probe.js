import probe from "probe-image-size";
//const imgUrl = "https://via.placeholder.com/350x150";
//const imgUrl = "https://www.dunhill.com/product_image/45634378WS/f/w508_bffffff.jpg";
//const imgUrl = "https://www.henkel.com/resource/image/1610198/16x9/1920/1098/803be6c94a6adfefc53bea6350229de2/DG/laboratory-4-zu-3.jpg";
//const imgUrl = "https://2022.cssday.it/img/speakers/massimo-artizzu.png";
//const imgUrl = "https://webpagetest.org/images/wpt_home_featureimg.jpg";
//const imgUrl = "https://dm.henkel-dam.com/is/image/henkel/Taft_campaign_2022_merkel_Magenta_Banner?wid=2560&fit=hfit&qlt=60";
const imgUrl = "https://www.isabelmarant.com/17/17210600cc_20_r.jpg";

const domainFinder = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/igm;
const domainResults = domainFinder.exec();
const referer = domainResults[0];

const imgIntrinsicWidth = await probe(imgUrl, {
  response_timeout: 2000,
  headers: {
    accept: "image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    "accept-encoding": "gzip, deflate, br",
    referer,
    "accept-language": "en-GB,en;q=0.9,en-US;q=0.8,it;q=0.7",
    "user-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36 Edg/100.0.1185.50",
  },
})
  .then((res) => {
    console.log("...succeded");
    return res.width;
  })
  .catch((err) => {
    console.log("...failed");
    console.error(err);
    return 0;
  });
console.log(imgIntrinsicWidth);
