function fridgePage(fridge){
return `
<h1>${fridge.data.attributes.name} Fridge</h1>
<div class="fridge-display"id="fridge-display">
    <img id="fridge-show" src='https://images.homedepot-static.com/productImages/5abd73e7-0790-4ab4-aa99-acd64ed909cc/svn/red-magic-chef-mini-fridges-hmcr320re-64_1000.jpg'>
</div>


<button id='post-to-fridge' class="btn btn-primary" type='button'>Post To Fridge</button>
<button id='leave-fridge' class="btn btn-primary" type='button'>Leave Fridge</button>

`
}

/* <p>${fridge.data.attributes.images[0].description}</p> 
        <button class="btn btn-primary" type='button'>Remove From Fridge</button> */
