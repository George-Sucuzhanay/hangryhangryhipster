
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
        loadFavStyle();  
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

let recipeGlobalIDArr = []

const createCard = (recipeData) => {

    let id = recipeData.id;
    recipeGlobalIDArr.push(id)
    let image = recipeData.image;
    let title = recipeData.title;
    let source = recipeData.spoonacularSourceUrl;
    let likes = recipeData.aggregateLikes;

    if(image===undefined){
        image="https://media.istockphoto.com/photos/question-mark-made-of-corn-seeds-on-plate-picture-id467083203?k=6&m=467083203&s=612x612&w=0&h=pfMfAgrliETJB2cUsxQBIkSXNlAKT4gf4hEEz80r4Hw="
    }    
    let path = "users/"+userGlobalID+"/favorites"
  return `
            <div class="col-sm-3">
                <div class="card d--flex align-items-stretch px-0 mb-3" style="background:white;">
                    <img class="card--img-top" src="${image}" alt="${title}" style="width:100%;background-color:black;">

                    <div class="card-body" style="text-align:center;height:2.75vw;">
                        <a href="https://www.w3schools.com/" target="_blank" style="font-size:1.5vw;font-family:Poppins;overflow:hidden;text-overflow: ellipsis;">${title}</a> 
                    </div>

                    <div class="card-footer border-0" style="background:white;">
                        <!--<span href="" class="favme glyphicon glyphicon-heart"></span>-->
                        <button class="btn" onclick="updateFavorites(${id})"><i id="${id}" class="favme glyphicon glyphicon-heart"></i></button>                 
                    </div>
                </div>
            </div>`      
}

function loadFavStyle(id){
    console.log('loading fav styles')
        firebase.database().ref(`users/${userGlobalID}/favorites`)
            .once('value', s => {
                if (s.exists()) {
                    for(item in recipeGlobalIDArr){
                        let id = recipeGlobalIDArr[item];
                        let favme = document.getElementById(id) 
                        //console.log(id)
                        for(let item in Object.keys(s.val())){
                            idFavs = s.val()[Object.keys(s.val())[item]].recipeID;
                            //console.log(idFavs)
                            if(idFavs==id){
                                console.log('already favorited')
                                favme.classList.add('mystyle')
                            }
                        }
                    }
                }
            })
}

const renderDataAsHTML = (data) => {
    //let cards = `<div class="card-deck"></div>`;
    let cards = ""
    for (let item in data) {
        //console.log(data[item])
        cards+=createCard(data[item])
  }
  document.querySelector("#app").innerHTML = cards;

};


function updateFavorites(id){
    console.log('entered')
    favme = document.getElementById(id) 

    if(!favme.classList.contains('mystyle')){
        favme.classList.add('mystyle');
        console.log('favorited')
        firebase
            .database()
            .ref(`users/${userGlobalID}/favorites`)
            .push({
                recipeID: id
            });
    }
    else{
        favme.classList.remove('mystyle');
        console.log('unfavorited')
        firebase.database().ref(`users/${userGlobalID}/favorites`)
        .once('value', s => {
            if (s.exists()) {
                for(let item in Object.keys(s.val())){
                    idStored = s.val()[Object.keys(s.val())[item]].recipeID;
                    if(idStored==id){
                        console.log('match for delete')
                        let path = Object.keys(s.val())[item]
                        console.log(path)
                        s.ref.child(path).remove()
                    }
                }
                }
            })
                }
}