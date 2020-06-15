document.addEventListener("DOMContentLoaded", () => {
    console.log("loaded");
    const navoptions = document.getElementById('navOptions')
    navoptions.style.display = "none"
    navoptions.hidden = false
    const login = document.getElementById("user-login")
    const signup = document.getElementById("user-create")
    const replaceable = document.getElementById("title-deep")
    let loggedInUser = false
    handleLogin()
    HandleSignup()

    function navButtons(){
        document.getElementById('home-button').addEventListener('click', function(){
            buildAccountPage()
        })
        document.getElementById('uplaod-image-button').addEventListener('click', function(){
            //run function 'buildUploadImgPage()' once its developed, this is just placeholder
            replaceable.innerHTML = uploadImgPage()
        })
        document.getElementById('add-fridge-button').addEventListener('click', function(){
            replaceable.innerHTML = newFridgePage()
        })
        document.getElementById('logout-button').addEventListener('click', function(){
            location.reload();
        })
        navoptions.style.display = "flex"
    }

    function handleLogin(){
        login.addEventListener("submit", (e) => {
            e.preventDefault()
            let loginData = e.target.username.value
            getUsers(loginData)
        })

        function getUsers(loginData){
            fetch('http://localhost:3000/users')
            .then(resp => resp.json())
            .then(json => findUser(json, loginData))
        }

        function findUser(json, loginData){
            json.forEach(user => {
                if(user.username == loginData){
                   return loggedInUser = user
                }
            })

            if(!loggedInUser){
                alert("That User Does Not Exist, Please Create An Account.")
            }else {
                navButtons()
                document.getElementById("user").innerText = loggedInUser.id
                fetch(`http://localhost:3000/users/${loggedInUser.id}`)
                .then(resp => resp.json())
                .then(json => {
                    loggedInUser = json.data.attributes
                    buildAccountPage()
                })
            }
        }
    }

    function HandleSignup(){
        signup.addEventListener("submit", (e) => {
            e.preventDefault()
            let signupData = e.target.username.value
            postUser(e)
        })

        function postUser(e){
            const data = {
                "username": e.target.username.value,
                "name": e.target.name.value
            }
            const configObj = {
                'method': 'POST',
                'headers': {
                    'Content-Type': "application/json",
                    Accept: 'application/json'
                },
                'body': JSON.stringify(data)
            }
            
            fetch('http://localhost:3000/users', configObj)
            .then(resp => resp.json())
            .then(json => {
                if(json){
                    alert("You Can Now Log In With That Username.")
                }
            })
            signup.username.value = ''
            signup.name.value = ''
        }
    }

    function buildAccountPage(){
        replaceable.innerHTML = accountPage()
        document.querySelector('.display-name').innerText = loggedInUser.name
        loggedInUser.images.forEach(image => {
            addPhotoToCollection(image)
        })
        loggedInUser.fridges.forEach(fridge => {
            addFridgeToCollection(fridge)
        })
        document.getElementById('delete-account').addEventListener('click', function(){
            if (confirm("Are you sure you wish to delete your account and all of its data?")) {
                // deleteUser();
                location.reload();
              }
        })

        function addPhotoToCollection(image){
            if(!!image.url){
                const album = document.getElementById('photo-collection')
                const div = document.createElement('div')
                div.className = "album-card"
                const div2 = document.createElement('div')
                div2.className = "image"
                const img = document.createElement('img')
                img.src = image.url
                img.width = "150"
                img.height = "150"
                div.className = 'photo-collection-display'
                div2.appendChild(img)
                div.appendChild(div2)
                album.appendChild(div)
            }
        }

        function addFridgeToCollection(fridge){
            const album = document.getElementById('fridge-collection')
            const div = document.createElement('div')
            div.className = "album-card"
            const div2 = document.createElement('div')
            const img = document.createElement('img')
            div2.className = "image"
            img.src = fridge.url
            img.width = "150"
            img.height = "300"
            div.className = 'fridge-colleection-display'
            div2.appendChild(img)
            div.appendChild(div2)
            album.appendChild(div)
        }

        // function deleteUser(){
        //     fetch(`http://localhost:3000/users/${loggedInUser.id}`, {
        //         method: 'DELETE',
        //     })
        //     .then(res => res.json()) // or res.json()
        //     .then(json => console.log(json))
        // }
    }
})