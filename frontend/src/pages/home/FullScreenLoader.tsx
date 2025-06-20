import Loader from '@/shared/components/Loader'

const FullScreenLoader = () => {
  return (
    <div className='fixed top-0 flex justify-center size-full bg-white z-50'>
      <div className='flex flex-col items-center gap-10 pt-20 px-4'>
        <div className='h-1/5'>
          <img src='/img/wardo-logo2.png' alt='wardo logo' className='size-full'/>
        </div>

        <h1 className='subtitle'>
          El servidor está despertando después de un periodo de inactividad.
          Esto puede tomar hasta 30 segundos...
        </h1>

        <Loader className='size-10' />
      </div>
    </div>
  )
}

export default FullScreenLoader
