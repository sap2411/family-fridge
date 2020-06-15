function accountPage(){
    return `
<h1>Account Page</h1>
<h2>Username: <span class='display-name'></span></h2>

<h3>Your Photos</h3>
<div id="photo-collection" class="album">

</div>

<h3>Your Fridges</h3>
<div id="fridge-collection" class="album">

</div><br>
<button id='delete-account' type='button'>Delete Account</button>
`
}