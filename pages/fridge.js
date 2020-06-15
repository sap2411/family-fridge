function fridgePage(fridge){
return `
<h1>${fridge.data.attributes.name} Fridge</h1>
<div id="fridge-display">
    <img src=${fridge.data.attributes.url}>
</div>

<div id="comment-box">
    <ul id='comment-list'>
    </ul>
</div>

<button name='Post To Fridge'>
<button name='Leave Fridge'>
`
}
/* <li><img src=${fridge.data.attributes.images.first.url}> <p>Discription</p> <button name='Comment'> */
