function uploadImgPage(){
return `
<h1>Upload An Image</h1>
<form action="/action_page.php" id='image_load'>
  <label for="img">Select image:</label>
  <input type="file" id="img-input" name="img" accept="image/*"><br>
  <input type="text" name="name" placeholder="Image gName"><br>
  <textarea id="img-description" name="description" rows="3" cols="50" mexlength="100" placeholder="Enter Image Description"></textarea><br>
  <select name='fridge' id='fridge_selection'>
    <option value="null">Select a Fridge</option>
  </select><br>
  <input type="submit">
</form>
`
}