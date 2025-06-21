import { RootState } from '@/app/store'
import { Button } from '@/shared/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/shared/components/ui/pagination"
import useScreenSize from '@/shared/hooks/useScreenSize'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router'

export function PaginationSection() {
  const [, setSearchParams] = useSearchParams()

  const { pagination } = useSelector((state: RootState) => 
    state.products.filteredResults.search
  )

  const isMobile = useScreenSize()

  // Creates an array of numbers until pages length
  const pagesArray = Array.from({ length: pagination.pages}).map((_, i) => {
    const nextIndex = i + 1
    if (i < pagination.pages) {
      return nextIndex
    }
  })

  return (
    <div>
      <Pagination >
        <PaginationContent>
          {/* Render 'previous' button that changes pagination on URL params and scrolls to top */}
          {pagination.page !== 1 && (
            <PaginationItem onClick={() => window.scrollTo({ top: 0 })}>
              <Button
                variant='outline'
                onClick={() => setSearchParams((prev) => {
                  prev.set('page', String(pagination.page - 1))
                  return prev
                })}
              >
                <ChevronLeftIcon />
                Anterior
              </Button>
            </PaginationItem>
          )}
          
          {/* DESKTOP: Renders pagination buttons with selected page being outline styled */}
          {!isMobile && pagesArray
            .filter((page): page is number => page !== undefined) // Filters undefined out of pages array
            .map((page: number) => (
              <PaginationItem key={page} onClick={() => window.scrollTo({ top: 0 })}>
                <Button
                  variant={pagination.page === page ? 'outline' : 'ghost'}
                  onClick={() => setSearchParams((prev) => {
                    prev.set('page', String(page))
                    return prev
                  })}
                >
                  {page}
                </Button>
              </PaginationItem>
            ))}

          {/* MOBILE: Renders pagination button with current page */}
          {isMobile && (
            <PaginationItem onClick={() => window.scrollTo({ top: 0 })}>
              <Button
                variant='outline'
                onClick={() => setSearchParams((prev) => {
                  prev.set('page', String(pagination.page))
                  return prev
                })}
              >
                {pagination.page}
              </Button>
            </PaginationItem>
          )}
          

          {/* Render 'next' button that changes pagination on URL params and scrolls to top */}
          {pagination.page < pagination.pages && (
            <PaginationItem onClick={() => window.scrollTo({ top: 0 })}>
              <Button
                variant='outline'
                onClick={() => setSearchParams((prev) => {
                  prev.set('page', String(pagination.page + 1))
                  return prev
                })}
              >
                Siguiente
                <ChevronRightIcon />
              </Button>
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  )
}