
let userGlobalID = null;

window.onload = event => {
    // Firebase authentication goes here.
    firebase.auth().onAuthStateChanged(user => {
    if (user) {
        // Console log the user to confirm they are logged in
        console.log("Logged in as: " + user.displayName);
        const googleUserId = user.uid;
        userGlobalID = googleUserId;  
    } else {
      // If not logged in, navigate back to login page.
      window.location = "index.html";
    }
  });
};

function makePlan(){    
    const recipes = firebase.database().ref(`users/${userGlobalID}/favorites`);
    recipes.on("value", snapshot => {
        let arr = []
        const data = snapshot.val();
        if(data!=null)
        {
            for(let item in Object.keys(data)){
                globalRecipeData = data;
                idFavs = data[Object.keys(data)[item]].recipeID;
                //console.log('here')
                arr.push(idFavs);
            }
            //console.log(arr.length)
            if(arr.length<6){
                alert("You need at least 6 items favorited to make a plan.")
            }
            else{
                // Shuffle array
                const shuffled = arr.sort(() => 0.5 - Math.random());
                let selected = shuffled.slice(0, 6);
                const spoonacularURL = "https://api.spoonacular.com/recipes/informationBulk"
                const apiKey = "c9a6277cf82249b9b64ccaeb744230f8"
                const authorizedURL = spoonacularURL + "?apiKey=" + apiKey + "&ids=" + selected.toString()
                fetch(authorizedURL)
                .then(response => {
                    return response.json();
                })
                .then(myjson => {
                    //price breakdown by ID returns HTML
                    //https://api.spoonacular.com/recipes/1082038/priceBreakdownWidget
                    //ingredient breakdown by ID returns HTML
                    //https://api.spoonacular.com/recipes/1082038/ingredientWidget
                    console.log(myjson)
                    let arr=[];
                    for(let item in myjson){
                    arr.push(myjson[item])
                    }
                    console.log(arr)
                    let ing = parseExtendedIngredients(arr,0)
                    document.querySelector("#monFront").innerHTML=`<p>${arr[0].title}</p>`

                    document.querySelector("#monBack").innerHTML=`<p>a</p>`

                    document.querySelector("#tuesFront").innerHTML=`<p>${arr[1].title}</p>`

                    document.querySelector("#tuesBack").innerHTML=`<p>a</p>`

                    document.querySelector("#wedFront").innerHTML=`<p>${arr[2].title}</p>`

                    document.querySelector("#wedBack").innerHTML=`<p>a</p>`

                    document.querySelector("#thursFront").innerHTML=`<p>${arr[3].title}</p>`

                    document.querySelector("#thursBack").innerHTML=`<p>a</p>`

                    document.querySelector("#friFront").innerHTML=`<p>${arr[4].title}</p>`

                    document.querySelector("#friBack").innerHTML=`<p>a</p>`

                    document.querySelector("#satFront").innerHTML=`<p>${arr[5].title}</p>`

                    document.querySelector("#satBack").innerHTML=`<p></p>`
                });
            }
        }
    });
}

function parseExtendedIngredients(){

}
