document.addEventListener("DOMContentLoaded", () => {
    console.log("loaded");
    const navoptions = document.getElementById('navOptions')
    navoptions.style.display = "none"
    navoptions.hidden = false
    const login = document.getElementById("user-login")
    const signup = document.getElementById("user-create")
    const replaceable = document.getElementById("title-deep")
    let loggedInUser = false
    let loggedInUserId = false
    let allUsers = false
    handleLogin()
    HandleSignup()

    function navButtons(){
        document.getElementById('home-button').addEventListener('click', function(){
            buildAccountPage()
        })
        document.getElementById('uplaod-image-button').addEventListener('click', function(){
            //run function 'buildUploadImgPage()' once its developed, this is just placeholder
            buildUploadImgPage()
        })
        document.getElementById('add-fridge-button').addEventListener('click', function(){
            buildNewFridgePage(allUsers, loggedInUser)
        })
        document.getElementById('logout-button').addEventListener('click', function(){
            location.reload();
        })
        navoptions.style.display = "flex"
    }

    function refreshUser(){
        fetch(`http://localhost:3000/users/${loggedInUser.id}`)
        .then(resp => resp.json())
        .then(json => {
            loggedInUserId = json.data.id
            loggedInUser = json.data.attributes
            buildAccountPage()
        })
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
            allUsers = json
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
                refreshUser()
            }
        }
    }

    function HandleSignup(){
        signup.addEventListener("submit", (e) => {
            e.preventDefault()
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
                    loggedInUserId = json.data.id
                    loggedInUser = json.data.attributes
                    refreshUser()
            }).catch(error => {alert(error)})
        }
    }

    function buildAccountPage(){
        document.body.className = "body_1 border-light"
        replaceable.className = "card_1 "
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
                deleteUser();
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
                img.className = "pic"
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
            const name = document.createElement('p')
            name.innerText = fridge.name
            const img = document.createElement('img')
            img.addEventListener('click', function(){
                buildFridgePage(fridge.id)
            })
            div2.className = "image"
            img.src = fridge.url
            img.className = "fridge pointer"
            div2.appendChild(img)
            div2.appendChild(name)
            div.appendChild(div2)
            album.appendChild(div)
        }

        function deleteUser(){
            fetch(`http://localhost:3000/users/${loggedInUserId}`, {
                method: 'DELETE',
            })
            .then(location.reload())
            // .catch(err => {
            //     alert(err)
            // })
        }
    }

    function buildFridgePage(id){
        fetch(`http://localhost:3000/fridges/${id}`)
        .then(resp => resp.json())
        .then(json => {
            console.log("here")
            console.dir(json);
            replaceable.innerHTML = fridgePage(json)
        })
    }

    function buildUploadImgPage(){
        replaceable.innerHTML = uploadImgPage()
        const form = document.getElementById("image_load")
        form.addEventListener("submit", function(event) {
            event.preventDefault()
            const fileInput = event.target.querySelector('input');
            const imageFile = fileInput.files[0];
            const formData = new FormData();
            formData.append('image', imageFile);

            const configObj = {
                method: "POST",
                headers: {
                    Authorization: "Client-ID 1c546c5b9f3b4ec"
                },
                body: formData
            }
            fetch("https://api.imgur.com/3/image",configObj)
            .then(resp => resp.json())
            .then(json => {
                console.log(json.data.link)
                refreshUser()
            })
            .catch(error => {
                console.error(error);
                //alert('Upload failed: ' + error);
            });
        })
    }

    function buildNewFridgePage() {
        replaceable.innerHTML = newFridgePage()
        let friends1 = document.getElementById("friends1")
        let friends2 = document.getElementById("friends2")
        let friends3 = document.getElementById("friends3")
        let friends4 = document.getElementById("friends4")
        let friends5 = document.getElementById("friends5")

        console.log(friends1, friends2, friends3, friends4, friends5)
      
        allUsers.forEach(user => {
          if (user.id != loggedInUserId) {
            friends1.appendChild(addFriend(user))
            friends2.appendChild(addFriend(user))
            friends3.appendChild(addFriend(user))
            friends4.appendChild(addFriend(user))
            friends5.appendChild(addFriend(user))
          }
        })

        function addFriend(user) {
            let option = document.createElement("option")
            option.value = user.id
            option.innerText = user.username
            return option
        } 
      }
})