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
            findUser(getUsers(), loginData)
        })

        function getUsers(){
            fetch('http://localhost:3000/users')
            .then(resp => resp.json())
            .then(json => json)
        }

        function findUser(json, loginData){
            let result = json.forEach(user => {
                if(user.username == loginData){
                    return user
                }
            })
            if(!result){
                alert("That User Does Not Exist, Please Create An Account.")
            }else {
                replaceable.innerHTML = accountPage
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