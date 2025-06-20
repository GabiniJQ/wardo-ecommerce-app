
const ProductNotFound = () => {
  return (
    <div className='md:text-center mt-20 min-h-screen space-y-10 px-4'>
      <h1 className='text-4xl text-primary'>No encontramos el producto que buscas...</h1>

      <p className='text-xl'>Prueba suerte en el buscador o <a href='/' className='link text-primary'>regresa a la página principal.</a></p>

      <div className='flex justify-center items-center'>
        <img src='/img/404.png' className='size-40'/>
      </div>
    </div>
  )
}

export default ProductNotFound
