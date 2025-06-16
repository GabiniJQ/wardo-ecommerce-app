import { IoLogoGithub, IoLogoInstagram, IoLogoTiktok } from 'react-icons/io5'

const Footer = () => {
  return (
    <footer className='bg-blue-dark text-slate-500 text-sm p-6 md:p-16'>
      <div className='grid grid-cols-3 w-full md:w-1/2 mx-auto gap-6 text-xs'>
        <div className=''>
          <ul className='flex flex-col gap-2'>
            <li>
              <p >
                Wardo by Jose Quintana. Todos los derechos reservados 2025©.
              </p>
            </li>

            <li>
              <p >Calle XX #00-00 Cartagena de Indias, Colombia.</p>
            </li>
          </ul>
        </div>

        <div>
          <ul className='flex flex-col gap-2 '>
            <li>
              <a href='' className='hover:underline'>
                Términos y condiciones
              </a>
            </li>

            <li>
              <a href='' className='hover:underline'>
                Accesibilidad
              </a>
            </li>

            <li>
              <a href='' className='hover:underline'>
                Aviso de privacidad
              </a>
            </li>
          </ul>
        </div>

        <div className='flex flex-col gap-2'>
          <p>Redes sociales oficiales</p>

          <ul className='flex gap-4'>
            <li>
              <a href=''>
                <IoLogoInstagram size={20} className='hover:scale-110'/>
              </a>
            </li>
            <li>
              <a href=''>
                <IoLogoTiktok size={20} className='hover:scale-110'/>
              </a>
            </li>
            <li>
              <a href='https://www.github.com/GabiniJQ' target='blank_'>
                <IoLogoGithub size={20} className='hover:scale-110'/>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer
