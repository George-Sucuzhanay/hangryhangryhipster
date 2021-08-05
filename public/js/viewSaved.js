
let userGlobalID = null;

window.onload = event => {
    // Firebase authentication goes here.
    firebase.auth().onAuthStateChanged(user => {
    if (user) {
        // Console log the user to confirm they are logged in
        console.log("Logged in as: " + user.displayName);
        const googleUserId = user.uid;
        userGlobalID = googleUserId;
        document.querySelector("#app").innerHTML="";
        //recipeFeed();   
        generateRecipeFeed(); 
        //loadFavStyle();  
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
    document.querySelector("#app").innerHTML="";
    console.log('working')
    let arr = [];
    const recipes = firebase.database().ref(`users/${userGlobalID}/favorites`);
    recipes.on("value", snapshot => {
        const data = snapshot.val();
        if(data!=null){
        for(let item in Object.keys(data)){
            globalRecipeData = data;
            idFavs = data[Object.keys(data)[item]].recipeID;
            arr.push(idFavs);
        }

        exploreData(arr)}
  });
}

let temp = "123"
function exploreData(data){
        document.querySelector("#app").innerHTML="";
        for(let item in data){
        idFav = data[item];
        recipeGlobalIDArr.push(idFav)
        console.log(idFav)
        const spoonacularURL = "https://api.spoonacular.com/recipes/"+idFav+"/information"
        const apiKey = "205a407444b3b4d0d8aaa0bfc0d247b07"
        const authorizedURL = spoonacularURL + "?apiKey=" + apiKey
        fetch(authorizedURL)
        .then(response => {
            return response.json();
        })
        .then(myjson => {
            //temp = myjson
            document.querySelector("#app").innerHTML+=renderDataAsHTML(myjson)
        });
    }
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
            <div class="col-sm-3" id="card${id}">
                <div class="panel d--flex align-items-stretch px-0 mb-3" style="background:white;border:none;">
                <div class="panel-heading" style="padding:0px;">
                <button type="button" class="btn" data-toggle="modal" data-target="#myModal" style="padding:0px;"><img src="${image}" alt="${title}" style="object-fit:cover;width:100%;background-color:black;"></button></div>

                    <div class="panel-body" style="text-align:center;height:2.75vw;">
                        <a href="https://www.w3schools.com/" target="_blank" style="font-size:1.75vw;font-family:Staatliches;display: block;
                        display: -webkit-box;margin: 0 auto;-webkit-line-clamp: 3;-webkit-box-orient: vertical;overflow: hidden;
                        text-overflow: ellipsis;}">${title}</a> 
                    </div class="panel-footer">
                    <br> <br> <br> <br> <br> <br> 
                        <button class="btn" onclick="updateFavorites(${id})"><i id="${id}" class="favme glyphicon glyphicon-heart mystyle"></i></button>    
                                     
                </div>
            </div>`      
}

// function loadFavStyle(id){
//     console.log('loading fav styles')
//         firebase.database().ref(`users/${userGlobalID}/favorites`)
//             .once('value', s => {
//                 if (s.exists()) {
//                     for(item in recipeGlobalIDArr){
//                         let id = recipeGlobalIDArr[item];
//                         //console.log(typeof(id))
//                         let favme = document.getElementById(id) 
//                         console.log(favme)
//                         //console.log(id)
//                         for(let item in Object.keys(s.val())){
//                             idFavs = s.val()[Object.keys(s.val())[item]].recipeID;
//                             //console.log(idFavs)
//                             if(idFavs==id){
//                                 console.log('already favorited')
//                                 favme.classList.add('mystyle')
//                             }
//                         }
//                     }
//                 }
//             })
// }

const renderDataAsHTML = (data) => {
    console.log(data)
    let card = "";
      card = createCard(data)
     return card;
  //document.querySelector("#app").innerHTML = cards;

};


function updateFavorites(id){
    console.log('entered')
        favme = document.getElementById(id) 
        favme.classList.remove('mystyle');
        card = document.getElementById("card"+id)
        card.remove()
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