function fridgePage(fridge){
return `
<h1>${fridge.data.attributes.name} Fridge</h1>
<div id="fridge-display">
    <img id="fridge-show" src=${fridge.data.attributes.url}>
</div>

<div id="comment-box">
    <ul id='comment-list'>
    </ul>
</div>

<button id='post-to-fridge' class="btn btn-primary" type='button'>Post To Fridge</button>
<button id='leave-fridge' class="btn btn-primary" type='button'>Leave Fridge</button>

`
}
/* <li><img src=${fridge.data.attributes.images.first.url}> <p>Discription</p> <button name='Comment'> */
