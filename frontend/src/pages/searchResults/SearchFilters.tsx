import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet'
import { Button } from '@/shared/components/ui/button'
import { HiArrowUp, HiFilter  } from 'react-icons/hi'
import { Slider } from '@/shared/components/ui/slider'
import ProductRating from '@/shared/components/ProductRating'
import { useState } from 'react'
import { formattedPrice } from '@/shared/utils/utils'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/store'

type SearchFiltersProps = {
  onFilterChange: (filters: Record<string, string>) => void
  initialValues: {
    minPrice?: string
    maxPrice?: string
  }
  pricesAverage: number
}

const SearchFilters = ({
  onFilterChange, initialValues, pricesAverage
}: SearchFiltersProps) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(initialValues.minPrice) || 0,
    Number(initialValues.maxPrice) || pricesAverage,
  ])

  const { allBrands, filteredBrands, filteredRating } = useSelector(
    (state: RootState) => state.products.filteredResults.search
  )

  const [selectedBrands, setSelectedBrands] = useState<string[]>(filteredBrands)
  const [selectedRating, setSelectedRating] = useState<number>(filteredRating)

  const applyFilters = () => {
    onFilterChange({
      minPrice: priceRange[0].toString(),
      maxPrice: priceRange[1].toString(),
      brands: selectedBrands.join(','),
      minRating: selectedRating.toString(),
    })
  }

  const resetFilters = () => {
    setPriceRange([0, pricesAverage])
    setSelectedBrands([])
    setSelectedRating(0)
    onFilterChange({
      minPrice: '',
      maxPrice: '',
      brands: '',
      minRating: '0',
    })
  }

  return (
    <div>
      <Sheet>
        <SheetTrigger className='flex gap-2 justify-center items-center h-10 text-primary btn'>
          <HiFilter/>
          Filtrar búsqueda
        </SheetTrigger>
        <SheetContent side='top'>
          <SheetHeader>
            <SheetTitle>Filtrar resultados</SheetTitle>
            <SheetDescription>
              Utiliza los filtros para encontrar con mayor facilidad tu
              producto deseado
            </SheetDescription>
          </SheetHeader>

          <div className='p-4'>
            <Accordion type='multiple'  className='w-full'>
              <AccordionItem value='item-1'>
                <AccordionTrigger className='font-semibold'>Precio</AccordionTrigger>
                <AccordionContent>
                  <div className='flex gap-4 items-center'>
                    <p className='text-sm'>Rango:</p>
                    
                    <Slider
                      max={pricesAverage}
                      step={1}
                      className='w-[40%]'
                      value={priceRange}
                      onValueChange={(value) => setPriceRange([value[0], value[1]])}
                    />

                    <p className='text-sm font-semibold'>
                      {formattedPrice(priceRange[0])} - {formattedPrice(priceRange[1])}{' '}
                      {priceRange[1] === pricesAverage && (
                        <span className='text-primary'>⬆</span>
                      ) }
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='item-2'>
                <AccordionTrigger className='font-semibold'>Valoración</AccordionTrigger>
                <AccordionContent>
                  <div className='flex gap-2'>
                    <Button
                      variant={
                        selectedRating === 4 ? 'default' : 'outline'
                      }
                      onClick={() => setSelectedRating((prev) => 
                        prev === 4 ? 0 : 4
                      )}
                    >
                      <ProductRating
                        rating={4}
                        className={selectedRating === 4 ? 'text-primary-foreground' : ''}
                      />
                      <HiArrowUp
                        className={selectedRating === 4 ? 'text-primary-foreground' : 'text-primary'}
                      />
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='item-3'>
                <AccordionTrigger className='font-semibold'>Marcas</AccordionTrigger>
                <AccordionContent className='flex gap-2 flex-wrap'>
                  {/* Brands display */}
                  {allBrands.map((brand) => {
                    const isSelected = selectedBrands.includes(brand)
                    return (
                      <Button
                        key={brand}
                        variant={isSelected ? 'default' : 'outline'}
                        onClick={() => setSelectedBrands((prev) => 
                          prev.includes(brand)
                            ? prev.filter(b => b !== brand)
                            : [...prev, brand]
                        )}
                      >
                        {brand}
                      </Button>
                    )
                  })}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <SheetFooter className='sm:flex-row'>
            <SheetClose
              className='flex items-center justify-center bg-primary h-8 px-4 py-2 text-primary-foreground text-sm btn rounded hover:bg-primary/90'
              onClick={() => applyFilters()}
            >
              Aplicar filtros
            </SheetClose>

            <Button
              variant='outline'
              className='h-8 text-secondary-foreground text-sm btn rounded'
              onClick={() => resetFilters()}
            >
              Limpiar filtros
            </Button>
          </SheetFooter>
        </SheetContent>
        
      </Sheet>
    </div>
  )
}

export default SearchFilters
