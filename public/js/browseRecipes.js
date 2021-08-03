
let userGlobalID = null;

window.onload = event => {
    // Firebase authentication goes here.
    firebase.auth().onAuthStateChanged(user => {
    if (user) {
        // Console log the user to confirm they are logged in
        console.log("Logged in as: " + user.displayName);
        const googleUserId = user.uid;
        userGlobalID = googleUserId;
        //recipeFeed();   
        generateRecipeFeed();   
    } else {
      // If not logged in, navigate back to login page.
      window.location = "index.html";
    }
  });
};

//for testing: apiKey = 26d5ee965b7041448718ba0f2475dc94
//for deploy: apiKey = xxx 
// function recipeFeed() {
//     //will return 5078 recipe cards for browsing
//     //
//     const spoonacularURL = "https://api.spoonacular.com/recipes/random"

//     const apiKey = "26d5ee965b7041448718ba0f2475dc94"

//     const authorizedURL = spoonacularURL + "?apiKey=" + apiKey + "&number=100"

//     fetch(authorizedURL)
//     .then(response => {
//         return response.json();
//     })
//     .then(myjson => {
//         //THIS IS WHERE YOU HANDLE THE RESPONSE JSON
//         console.log(myjson);
//         storeRecipes(myjson)
//     });
// }

//to avoid filling api request quota
// function storeRecipes(myjson){
//     console.log('entered')
//     firebase
//         .database()
//         .ref(`recipes`)
//         .push({
//             JSONObj: myjson
//         });
//     const recipes = firebase.database().ref(`recipes`);
//     recipes.on("value", snapshot => {
//         const data = snapshot.val();
//         console.log(data)
//   });
// };

let globalRecipeData = null

function generateRecipeFeed(){
    const recipes = firebase.database().ref(`recipes`);
    recipes.on("value", snapshot => {
        const data = snapshot.val();
        globalRecipeData = data;
        let recipeArray = exploreData(globalRecipeData);
        renderDataAsHTML(recipeArray);
  });
}

function exploreData(data){
    let jsonObj = null;
    for(let item in data){
        jsonObj = data[item].JSONObj.recipes;
        //console.log(jsonObj);
    };
    // console.log(jsonObj[0])
    // for(let item in jsonObj){
    //     console.log(jsonObj[item])
    // }
    return jsonObj;
}

const createCard = (recipeData) => {

    let id = recipeData.id;
    let image = recipeData.image;
    let title = recipeData.title;
    let source = recipeData.spoonacularSourceUrl;
    let likes = recipeData.aggregateLikes;

    if(image===undefined){
        image="https://media.istockphoto.com/photos/question-mark-made-of-corn-seeds-on-plate-picture-id467083203?k=6&m=467083203&s=612x612&w=0&h=pfMfAgrliETJB2cUsxQBIkSXNlAKT4gf4hEEz80r4Hw="
    }    

  return `
            <div class="col-sm-3">
                <div class="card px-0 mb-3" style="background:white;">
                    <img class="card--img-top" src="${image}" alt="${title}">

                    <div class="card-body">
                        <section>
                        <h4 class="card-title text-center">${title}</h4>
                    </div>

                    <div class="card-footer border-0" style="background:white;">
                        <a href="#" class="btn btn-primary">See Profile</a>
                    </div>
                </div>
            </div>`;
}

const renderDataAsHTML = (data) => {
    //let cards = `<div class="card-deck"></div>`;
    let cards = ""
    for (let item in data) {
        console.log(data[item])
        cards+=createCard(data[item])
  }
  document.querySelector("#app").innerHTML = cards;
};



