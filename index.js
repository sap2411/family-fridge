document.addEventListener("DOMContentLoaded", () => {
    console.log("loaded");
    const login = document.getElementById("user-login")
    const signup = document.getElementById("user-create")
    const replaceable = document.getElementById("title-deep")
    handleLogin()
    HandleSignup()

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
            let check = false
            json.forEach(user => {
                if(user.username == loginData){
                    check = user
                }
            })

            if(!check){
                alert("That User Does Not Exist, Please Create An Account.")
            }else {
                replaceable.innerHTML = accountPage
                document.getElementById("user").innerText = check.id
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
        }
    }
})