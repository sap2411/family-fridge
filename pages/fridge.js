function fridgePage(fridge){
return `
<h1>${fridge.data.attributes.name} Fridge</h1>
<div class="fridge-display"id="fridge-display">
    <img id="fridge-show" src='https://images.homedepot-static.com/productImages/5abd73e7-0790-4ab4-aa99-acd64ed909cc/svn/red-magic-chef-mini-fridges-hmcr320re-64_1000.jpg'>
</div>

<div id='comment-box'>
<div class="image-container" id="comment-area" hidden='true'>
      <div class="image-card">
        <h2 class="title">Title of image goes here</h2>
        <img  class="image2" />
        <ul class="comments">
        </ul>
        <form class="comment-form">
          <input
            class="comment-input"
            type="text"
            name="comment"
            placeholder="Add a comment..."
          />
          <button class="comment-button" type="submit">Post</button>
        </form>
      </div>
    </div>
</div>


<button id='post-to-fridge' class="btn btn-primary" type='button'>Post To Fridge</button>
<button id='leave-fridge' class="btn btn-primary" type='button'>Leave Fridge</button>

`
}

/* <p>${fridge.data.attributes.images[0].description}</p> 
        <button class="btn btn-primary" type='button'>Remove From Fridge</button> */
