
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
                const apiKey = "674d71d05662414fbb8e39eb0ac513c1"
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
                    //console.log(myjson)
                    let arr=[];
                    for(let item in myjson){
                    arr.push(myjson[item])
                    }
                    //console.log(arr)
                    let moning = parseIngText(parseExtendedIngredients(arr[0]))
                    document.querySelector("#monFront").innerHTML=`<p>${arr[0].title}</p><div>${moning}</div>`

                    let tuesing = parseIngText(parseExtendedIngredients(arr[1]))
                    document.querySelector("#tuesFront").innerHTML=`<p>${arr[1].title}</p><div>${tuesing}</div>`

                    let weding = parseIngText(parseExtendedIngredients(arr[2]))
                    document.querySelector("#wedFront").innerHTML=`<p>${arr[2].title}</p><div>${weding}</div>`

                    let thursing = parseIngText(parseExtendedIngredients(arr[3]))
                    document.querySelector("#thursFront").innerHTML=`<p>${arr[3].title}</p><div>${thursing}</div>`

                    let friing = parseIngText(parseExtendedIngredients(arr[4]))
                    document.querySelector("#friFront").innerHTML=`<p>${arr[4].title}</p><div>${friing}</div>`

                    let sating = parseIngText(parseExtendedIngredients(arr[5]))
                    document.querySelector("#satFront").innerHTML=`<p>${arr[5].title}</p><div>${sating}</div>`

                });
                widgetGenerator(selected)
            }
        }
    });
}

function widgetGenerator(arr){
    for(let item in arr){
        const spoonacularURL = "https://api.spoonacular.com/recipes/" + arr[item] + "/nutritionWidget"
        const apiKey = "674d71d05662414fbb8e39eb0ac513c1"
        const authorizedURL = spoonacularURL + "?apiKey=" + apiKey + "&defaultCss=true"
            fetch(authorizedURL)
            .then(response => {
                return response.body;
            })
            .then(rb => {
                const reader = rb.getReader();
                return new ReadableStream({
                    start(controller) {
                    // The following function handles each data chunk
                    function push() {
                        // "done" is a Boolean and value a "Uint8Array"
                        reader.read().then( ({done, value}) => {
                        // If there is no more data to read
                        if (done) {
                            console.log('done', done);
                            controller.close();
                            return;
                        }
                        // Get the data and send it to the browser via the controller
                        controller.enqueue(value);
                        // Check chunks by logging to the console
                        console.log(done, value);
                        push();
                        })
                    }
                    push();
                    }
                });
                })
                .then(stream => {
                // Respond with our stream
                return new Response(stream, { headers: { "Content-Type": "text/html" } }).text();
                })
                .then(result => {
                // Do things with result
                    console.log(result)
                    document.getElementById(item).innerHTML=result;
                });
            }
                }

function parseExtendedIngredients(arr){
    let list = []
    let ext = arr.extendedIngredients
    //console.log(ext)
    for(let item in ext){
        //console.log(ext[item])
        //console.log(ext[item].aisle)
        list.push({
            "aisle":ext[item].aisle,
            "name":ext[item].nameClean
        })
    }
    //console.log(list)
    return list
}

function parseIngText(arr){
    let table=`<table id="t01" style="font-size:13px;font-family:Londrina Solid; text-align:center;">
  <tr>
    <th>Aisle</th>
    <th>Ingredient</th> 
  </tr>`
    
    if(arr.length>10){
        arr=arr.slice(0,10)
        viewMoreModal(arr)
        //console.log("slicing")
        for(let ing in arr){
            table+=`<tr><td>${arr[ing].aisle}</td><td>${arr[ing].name}</td></tr>`
        }
        return table+`<tr><td>"..."</td><td>"..."</td></tr></table>`
    }
    else{
        for(let ing in arr){
            table+=`<tr><td>${arr[ing].aisle}</td><td>${arr[ing].name}</td></tr>`
        }
        return table+`</table>`
    }
}

function viewMoreModal(arr){
    //console.log("opening")    
    extraStuff=document.querySelector("#extra")
    let table=`<table id="t01" style="font-size:13px;font-family:Londrina Solid; text-align:center;">
  <tr>
    <th>Aisle</th>
    <th>Ingredient</th> 
  </tr>`
    for(let ing in arr){
        table+=`<tr><td>${arr[ing].aisle}</td><td>${arr[ing].name}</td></tr>`
    }
    table+=`</table>`
    extra.innerHTML=table;
}

