function newFridgePage(users){ 
return `
<h1>Make A New Fridge</h1>
<form id="new_fridge_form">
<input type="text" name="title" placeholder="Fridge Name"><br>
<select name="friends" id="friends1">
  <option value="null">Select a Friend</option>
</select><br>
<select name="friends" id="friends2">
  <option value="null">Select a Friend</option>
</select><br>
<select name="friends" id="friends3">
  <option value="null">Select a Friend</option>
</select><br>
<select name="friends" id="friends4">
  <option value="null">Select a Friend</option>
</select><br>
<select name="friends" id="friends5">
  <option value="null">Select a Friend</option>
</select><br>
<input type='submit' name='submit' class="btn btn-primary">
</form>
`
}