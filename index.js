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
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            buildAccountPage()
        })
        document.getElementById('uplaod-image-button').addEventListener('click', function(){
            //run function 'buildUploadImgPage()' once its developed, this is just placeholder
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            buildUploadImgPage()
        })
        document.getElementById('add-fridge-button').addEventListener('click', function(){
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            buildNewFridgePage(allUsers, loggedInUser)
        })
        document.getElementById('logout-button').addEventListener('click', function(){
            document.body.scrollTop = document.documentElement.scrollTop = 0;
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
                loggedInUserId = json.data.id
                loggedInUser = json.data.attributes
                document.getElementById("user").innerText = loggedInUser.id
                fetch('http://localhost:3000/users')
                .then(resp => resp.json())
                .then(json => {
                    allUsers = json;
                    refreshUser()
                })})
                .catch(error => {alert(error)})
        }
    }

    function buildAccountPage(){
        document.body.className = "body_1 border-light"
        replaceable.className = "card_1 "
        replaceable.innerHTML = accountPage()
        document.querySelector('.display-name').innerText = loggedInUser.username
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
                const name = document.createElement('p')
                name.innerText = image.name
                div2.appendChild(img)
                div2.appendChild(name)
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
                document.body.scrollTop = document.documentElement.scrollTop = 0;
                buildFridgePage(fridge.id)
            })
            div2.className = "image"
            img.src = 'https://images.homedepot-static.com/productImages/5abd73e7-0790-4ab4-aa99-acd64ed909cc/svn/red-magic-chef-mini-fridges-hmcr320re-64_1000.jpg'
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
            const post = document.querySelector('.comment-form')
            const imgTag = document.querySelector('.image2')
            const title = document.querySelector('.title')
            const commentList = document.querySelector('.comments')
            let fridgeDiv = document.getElementById('fridge-display');

            post.addEventListener('submit', function(e){
                e.preventDefault();
                postCommentFetch(e)
            })

            let i = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            const fridge_images = fridge.data.attributes.images.length
            let j = fridge_images
            if (fridge_images > 10) {
                j = 10
            }
            while(j > 0) {
                let pic = fridge.data.attributes.images[fridge_images - j]
                let polDiv = document.createElement('div');
                let index = Math.floor(Math.random() * Math.floor(i.length));
                polDiv.className = `polaroid-card polaroid-${i[index]} pointer r-${i[index]}`
                i.splice(index, 1)

                let img = document.createElement('img');
                img.className = 'fridge-img'
                img.src = pic.url
                img.name = pic.id

                let titleDiv = document.createElement('div');
                titleDiv.className = 'img-text-div'
                let p = document.createElement('p')
                p.innerText = pic.name
                
                titleDiv.appendChild(p)
                polDiv.appendChild(img)
                polDiv.appendChild(titleDiv)
                fridgeDiv.appendChild(polDiv)

                addListenerToPolaroid(polDiv, pic)
                j--
            }

            function postCommentFetch(e){
                const data = {
                    "image_id": imgId,
                    'user_id': loggedInUserId,
                    "comment_info": `${loggedInUser.name}: ${e.target.comment.value}`
                }
                const configObj = {
                    'method': 'POST',
                    'headers': {
                        'Content-Type': "application/json",
                        Accept: 'application/json'
                    },
                    'body': JSON.stringify(data)
                }
                
                fetch('http://localhost:3000/comments', configObj)
                .then(resp => resp.json())
                .then(json => displayNewComment(json))
                post.comment.value = ''
            }

            function displayNewComment(json){
                const li = document.createElement('li')
                li.className = 'li-section'
                li.id = json.data.id
                li.textContent = json.data.attributes.comment_info
                deleteButton(li)
                commentList.appendChild(li)
            }

            function addListenerToPolaroid(polaroid, json){
                polaroid.addEventListener('click', function(){
                    fillCommentDiv(json)
                })
            }

            function fillCommentDiv(image){
                let commentArea = document.getElementById('comment-area');
                const imageCommentId = document.querySelector('.image-id')
    
                if(!commentArea.hidden && image.id == imageCommentId.value){
                    commentArea.hidden = true
                }else{
                    imageCommentId.value = image.id
                    commentArea.hidden = false
    
                    fetchImg(image)
                }
            }

            function displayComment(json){
                const li = document.createElement('li')
                li.className = 'li-section'
                li.id = json.id
                li.textContent = json.comment_info
                if(loggedInUserId == json.user_id){
                    deleteButton(li)
                }
                commentList.appendChild(li)
            }

            function fetchImg(image){
                fetch(`http://localhost:3000/images/${image.id}`)
                .then(resp => resp.json())
                .then(json => showImg(json))
                .catch(error => console.error(error))
            }

            function deleteCommentFetch(n){
                fetch(`http://localhost:3000/comments/${n}`, {method: 'delete'})
                .then(resp => resp.json())
                .then(function(){
                    const li = document.getElementById(n)
                    li.remove()
                })
                .catch(error => console.error(error))
            }
            
            function showImg(image){
                imgId = image.data.id
                imgTag.src = image.data.attributes.url
                title.innerText = image.data.attributes.name
                document.getElementById("description").innerText = image.data.attributes.description;
                commentList.innerHTML = ''
                for (const comment of image.data.attributes.comments){
                    displayComment(comment)
                }
                window.scrollTo(0,document.body.scrollHeight);
            }

            function deleteButton(li){
                let button = document.createElement('button')
                button.className = 'btn-primary delete-button'
                button.innerHTML = 'Delete'
                li.appendChild(button)
                button.addEventListener('click', function(e){
                    deleteCommentFetch(e.target.parentNode.id)
                })
            }
        }
    }

    function buildUploadImgPage(){
        replaceable.innerHTML = uploadImgPage()
        const form = document.getElementById("image_load")
        populateForm()
        form.addEventListener("submit", function(event) {
            event.preventDefault()
            console.dir(event.target.fridge_selection.value)
            const fileInput = event.target.querySelector('input');
            const imageFile = fileInput.files[0];
            const formData = new FormData();
            formData.append('image', imageFile);

            if (imageFile && event.target.fridge_selection.value != "null") {
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
                });
            } else {
                alert("Please make sure you have Uploaded an Image and Chosen a fridge")
            }
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




