function uploadImgPage(){
return `
<h1>Upload An Image</h1>
<form action="/action_page.php">
  <label for="img">Select image:</label>
  <input type="file" id="img-input" name="img" accept="image/*">
  <input type="submit">
</form>
`
}