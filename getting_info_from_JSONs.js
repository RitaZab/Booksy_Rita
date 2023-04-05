const fs = require("fs");
const { off } = require("process");
const mysql = require( 'mysql2');
const dotenv =require('dotenv');
dotenv.config()
const connection = mysql.createPool({
    host:process.env.MYSQL_HOST,
    user:process.env.MYSQL_USER,
    password:process.env.MYSQL_PASSWORD,
    database:process.env.MYSQL_DATABASE
}).promise();
const regex1 = /[0-9][0-9]/g;
const regex2 = /[0-9][0-9][0-9]/g;
async function addingValues(id, company_name, country, voivodeship, city, county, post_code, street, telephone, website, facebook, instagram, offer, about, review_rating, nr_of_reviews, booksy_link, status) {
  const [newRow] = await connection.query
        (`INSERT IGNORE booksy_complete(id, company_name, country, voivodeship, city, county, post_code, street, telephone, website, facebook, instagram, offer, about, review_rating, nr_of_reviews, booksy_link, status)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [id, company_name, country, voivodeship, city, county, post_code, street, telephone, website, facebook, instagram, offer, about, review_rating, nr_of_reviews, booksy_link, status])
    
    console.log(`Value ${company_name} set on ${id}`)
}

for (let x=1;x<2000;x++){ //main loop
  const max=200000
  randomID= Math.floor(Math.random()*max)
  console.log(randomID)

let path=`/var/bots/booksy_4th/businesses/${randomID}.json`
console.log(path)
let fileDownloaded
try{
  if(fs.existsSync(path)){
      console.log("It exists")
      fileDownloaded=true // here pass the code
      console.log(fileDownloaded)}
      
      if(fileDownloaded==true){
        console.log("Sprawdz jsona")
      
      fs.readFile(path, "utf8", (err, jsonString) => {
        console.log(path)
        console.log('Trying to get JSON')
        try {
            const company = JSON.parse(jsonString);
            //console.log(company)
             // => "Customer address is: Infinity Loop Drive"
            let id = company.business.id
            let company_name = company.business.name
            let country = company.business.regions[0].full_name
            let voivodeship = company.business.regions[1].full_name
            let city = company.business.regions[2].full_name
            let countyRAW = company.business.regions[3].name
            let county = countyRAW.split(" ")[1]
            
          let addressRAW = company.business.location.address
          //generating post_code//
          let post_codeRAW1 = addressRAW.match(regex1)
          //console.log(post_codeRAW1[0])
          let post_codeRAW2 = addressRAW.match(regex2)
          //console.log(post_codeRAW2[0])
          let post_code = post_codeRAW1[0] + "-" + post_codeRAW2
          
      
          let address = addressRAW.split(",")[0]
          let offerCategory = company.business.service_categories
          let countCategories = Object.keys(offerCategory).length
          let offerListToConvert = []
         let count
          for (let y = 0; y < countCategories; y++){
            var category = company.business.service_categories[y].name
            //console.log(category)
            let offer = company.business.service_categories[y].services
             count= Object.keys(offer).length
            let offerListRAW = []
          
          for (let x = 0; x < count; x++){
            var singleOffer = company.business.service_categories[y].services[x].name
            let variantList=company.business.service_categories[y].services[x].variants
            //console.log(company.business.service_categories[y].services[x].variants)
            let variantsCount = Object.keys(variantList).length
            //console.log(variantsCount)
            let variantsList=[]
            for (let z = 0; z < variantsCount; z++) { 
              let singleVariant = company.business.service_categories[y].services[x].variants[z].label
              //console.log(singleVariant)
              variantsList.push(singleVariant)
              
            }
            //console.log(variantsList)
            singleOffer=singleOffer+" ( "+variantsList+" ) "
            offerListRAW.push(singleOffer)
            
            
          }offerListToConvert.push(`[${category}: ${offerListRAW}]`)
          }
      
          
          let offerListReady = offerListToConvert.toString()
          let about = company.business.description
          let noOfReview = company.business.reviews_count
          let reviewRankRAW = company.business.reviews_rank
          let reviewRank = reviewRankRAW.toFixed(2)
          let telephone = company.business.phone
          let website = company.business.website
          let facebook = company.business.facebook_link
          let instagram = company.business.instagram_link
          let booksyLink = 'https://booksy.com/pl-pl/' + company.business.url
          let status="done"
            console.log(count)
            console.log(`Id: ${id}
      Company name: ${company_name}
      Country: ${country}
      Voivodeship: ${voivodeship}
      City: ${city}
      County: ${county}
      ${post_code}
      ${address}
      telephone: ${telephone}
      website: ${website}
      facebook: ${facebook}
      instagram:${instagram}
      Offer: 
      ${offerListReady}
      About:
      ${about}
      Review: rating: ${reviewRank} ,number of reviews ->${noOfReview}
      Booksy link: ${booksyLink}`
          )
          addingValues(id, company_name, country, voivodeship, city, county, post_code, address, telephone, website, facebook, instagram, offerListReady, about, reviewRank, noOfReview, booksyLink, status)
        } catch (err) {
          console.log("Error parsing JSON string:", err);
             }})}

}catch(err){
  console.log(err)
  fileDownloaded=false
}}



      






