document.addEventListener("DOMContentLoaded", () => {
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
        fetch(`http://localhost:3000/users/${loggedInUserId}`)
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
                loggedInUserId = loggedInUser.id
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
                navButtons()
                document.getElementById("user").innerText = loggedInUser.id
                loggedInUserId = json.data.id
                loggedInUser = json.data.attributes
                refreshUser()
            }).catch(error => {alert(error)})
        }
    }

    function buildAccountPage(){
        console.log("in build account page")
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
            replaceable.innerHTML = fridgePage(json);
            populateFridge(json)
        })

        function populateFridge(fridge){
            console.log("start")
            let fridgeDiv = document.getElementById('fridge-display');
            let i = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            fridge.data.attributes.images.forEach(pic => {
                console.log("forEach")
                let polDiv = document.createElement('div');
                let index = Math.floor(Math.random() * Math.floor(i.length));
                polDiv.className = `polaroid-card polaroid-${i[index]}`
                i.splice(index, 1)
                let img = document.createElement('img');
                img.className = 'fridge-img'
                img.src = pic.url
                let titleDiv = document.createElement('div');
                titleDiv.className = 'img-text-div'
                let p = document.createElement('p')
                p.innerText = pic.name
                titleDiv.appendChild(p)
                polDiv.appendChild(img)

                polDiv.appendChild(titleDiv)
                fridgeDiv.append(polDiv)
            })

        }
    }

    function buildUploadImgPage(){
        replaceable.innerHTML = uploadImgPage()
        const form = document.getElementById("image_load")
        populateForm()
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
                postImgToBackend(json.data.link, event)
            })
            .catch(error => {
                console.error(error);
                //alert('Upload failed: ' + error);
            });
        })

        function postImgToBackend(link, e){
            const data = {
                "url": link,
                "name": e.target.name.value,
                "description": e.target.description.value,
                "fridge_id": e.target.fridge.value,
                "user_id": loggedInUserId
            }
            const configObj = {
                'method': 'POST',
                'headers': {
                    'Content-Type': "application/json",
                    Accept: 'application/json'
                },
                'body': JSON.stringify(data)
            }
            
            fetch('http://localhost:3000/images', configObj)
            .then(resp => resp.json())
            .then(refreshUser)
            .catch(error => {alert(error)})
        }

        function populateForm(){
            let select = document.getElementById('fridge_selection')
            loggedInUser.fridges.forEach(fridge => {
                let option = document.createElement('option')
                option.value = fridge.id
                option.innerText = fridge.name
                select.appendChild(option)
            })
        }
    }

    function buildNewFridgePage() {
        replaceable.innerHTML = newFridgePage()
        let friends1 = document.getElementById("friends1")
        let friends2 = document.getElementById("friends2")
        let friends3 = document.getElementById("friends3")
        let friends4 = document.getElementById("friends4")
        let friends5 = document.getElementById("friends5")

        let friends_array = [friends1, friends2, friends3, friends4, friends5]
      
        allUsers.forEach(user => {
          if (user.id != loggedInUserId) {
            friends_array.forEach(friends => {
                friends.appendChild(addFriend(user))
            })
          }
        })

        friends_array.forEach(friends => {
            addSelectFriendEvent(friends)
        })

        function addFriend(user) {
            let option = document.createElement("option")
            option.value = user.id
            option.innerText = user.username
            return option
        } 

        function removeFriendOptions(myNode) {
            while (myNode.lastChild.value != "null") {
                myNode.removeChild(myNode.lastChild);
            }
        }

        function addSelectFriendEvent(selection) {
            selection.addEventListener ("change", function(event) {
                let friends_value_array = [friends1.value, friends2.value, friends3.value, friends4.value, friends5.value]
                friends_array.forEach(friends => removeFriendOptions(friends))

                allUsers.forEach(user => {
                    if (user.id != loggedInUserId) {
                        for(friends in friends_array) {
                            if (!friends_value_array.includes(user.id.toString())) {
                                friends_array[friends].appendChild(addFriend(user))
                            } else if (friends_value_array[friends] == user.id) {
                                friends_array[friends].appendChild(addFriend(user))
                                friends_array[friends].value = user.id
                            }
                        }
                    }
                })
            })
        }

        document.getElementById('new_fridge_form').addEventListener('submit', (e) => {
            e.preventDefault()
            buildFridge(e)
        })

        function buildAssociations(e, fridge_id){
            console.log("heres the fridge_id")
            let arr = [loggedInUserId, e.target.friends1.value, e.target.friends2.value, e.target.friends3.value, e.target.friends4.value, e.target.friends5.value]
            console.dir(arr);

            arr.forEach(item => {
                if(item != 'null'){
                    const data = {
                        "user_id": item,
                        "fridge_id": fridge_id
                    }
                    const configObj = {
                        'method': 'POST',
                        'headers': {
                            'Content-Type': "application/json",
                            Accept: 'application/json'
                        },
                        'body': JSON.stringify(data)
                    }
                    
                    fetch('http://localhost:3000/user_fridges', configObj)
                    .then(resp => resp.json())
                    .then(json => console.log(json))
                    .catch(error => {alert(error)})
                }
            })
        }

        function buildFridge(e){
            let user_fridge_data = [{user_id: loggedInUserId}]
            friends_array.forEach(friend => {
                if (friend.value != "null") {
                    user_fridge_data.push({user_id: friend.value})
                }
            })
            const data = {
                "url": 'https://c.shld.net/rpx/i/s/i/spin/10109385/prod_22969766112?hei=333&wid=333&op_sharpen=1',
                "name": e.target.title.value,
                "user_fridges_attributes": user_fridge_data
            }
            const configObj = {
                'method': 'POST',
                'headers': {
                    'Content-Type': "application/json",
                    Accept: 'application/json'
                },
                'body': JSON.stringify(data)
            }
            
            fetch('http://localhost:3000/fridges', configObj)
            .then(resp => resp.json())
            .then(refreshUser)
            .catch(error => {alert(error)})
        }
      }
})