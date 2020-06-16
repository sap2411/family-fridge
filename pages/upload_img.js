function uploadImgPage(){
return `
<h1>Upload An Image</h1>
<form action="/action_page.php">
  <label for="img">Select image:</label>
  <input type="file" id="img-input" name="img" accept="image/*">
  <textarea id="img-description" name="description" rows="4" cols="50" mexlength="100" placeholder="Enter Image Description">
  <input type="submit">
</form>
`
}