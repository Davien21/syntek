let allProducts;
async function getAllProducts () {
  try {
    let response = await fetch(productsEndpoint) 
    response =  await response.json().then(data => data)
    allProducts = response
    return response
  } catch (ex) {
    return { status:false, message: ex }
  }
}
