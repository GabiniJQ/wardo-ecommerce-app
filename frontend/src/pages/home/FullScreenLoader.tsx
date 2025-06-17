import Loader from '@/shared/components/Loader'

const FullScreenLoader = () => {
  return (
    <div className='fixed top-0 flex justify-center size-full bg-white z-50'>
      <div className='flex flex-col items-center gap-10 pt-20'>
        <h1 className='subtitle'>
          Esperando la inicialización del servidor. Puede tomar hasta 20 segundos...
        </h1>

        <Loader className='size-10' />
      </div>
    </div>
  )
}

export default FullScreenLoader
