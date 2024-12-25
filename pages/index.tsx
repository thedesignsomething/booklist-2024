'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Book } from '../types/book'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

declare module 'react' {
    interface CSSProperties {
      '--primary-color'?: string;
      '--secondary-color'?: string;
    }
}

type CMSData = {
  pageTitle: string;
  pageDescription: string;
  appearance: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  filterCategories: {
    name: string;
    values: string[];
  }[];
}

export default function BookShowcase() {
  const [books, setBooks] = useState<Book[]>([])
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [cmsData, setCmsData] = useState<CMSData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const cmsResponse = await fetch('/api/cms')
        const rawCmsData = await cmsResponse.json()
        
        const booksResponse = await fetch('/api/books')
        const booksData = await booksResponse.json()

        setCmsData({
          pageTitle: rawCmsData.pageTitle,
          pageDescription: rawCmsData.pageDescription,
          appearance: {
            primaryColor: rawCmsData.primaryColor,
            secondaryColor: rawCmsData.secondaryColor,
            fontFamily: rawCmsData.fontFamily,
          },
          filterCategories: JSON.parse(rawCmsData.filterCategories)
        })

        setBooks(booksData)

        if (rawCmsData.filterCategories) {
          const categories = JSON.parse(rawCmsData.filterCategories)
          const initialFilters = categories.reduce((acc: Record<string, string[]>, category: { name: string }) => {
            acc[category.name] = []
            return acc
          }, {})
          setSelectedFilters(initialFilters)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredBooks = useMemo(() => {
    if (!cmsData) return books
    return books.filter((book) => {
      return Object.entries(selectedFilters).every(([category, values]) => {
        if (values.length === 0) return true
        
        switch (category) {
          case 'Fiction / Non-Fiction':
            return values.includes(book.genre)
          case 'Vibe':
            return values.includes(book.vibe)
          case 'Reading Format':
            return values.includes(book.readingFormat)
          case 'Recommendations':
            // Handle Top 10 filter
            return values.includes('Top 10') ? book.isTop10 : true
          default:
            return true
        }
      })
    })
  }, [books, selectedFilters, cmsData])

  const toggleFilter = (category: string, value: string) => {
    setSelectedFilters(prev => {
      const currentValue = prev[category]?.[0] // Get the currently selected value (if any)
      
      // If clicking the already selected value, deselect it
      if (currentValue === value) {
        return {
          ...prev,
          [category]: []
        }
      }
      
      // Otherwise, set this as the only selected value for this category
      return {
        ...prev,
        [category]: [value]
      }
    })
  }

  const resetFilters = () => {
    if (!cmsData) return
    const resetFilters = cmsData.filterCategories.reduce((acc: Record<string, string[]>, category) => {
      acc[category.name] = []
      return acc
    }, {})
    setSelectedFilters(resetFilters)
  }

  const FilterCategory = ({ title, values }: { title: string, values: string[] }) => (
    <div className="py-2 first:pt-0 last:pb-0">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {values.filter(value => value !== 'All').map((value) => (
          <Badge
            key={value}
            variant={selectedFilters[title]?.includes(value) ? "default" : "outline"}
            className="cursor-pointer text-lg px-6 py-3 transition-all duration-200 ease-in-out hover:scale-105"
            onClick={() => toggleFilter(title, value)}
          >
            {value}
          </Badge>
        ))}
      </div>
    </div>
  )

  if (isLoading) return <div>Loading...</div>
  if (!cmsData) return <div>No data available</div>

  return (
    <div className="container mx-auto px-6 py-4 md:h-[calc(100vh-2rem)] md:overflow-hidden" style={{
      fontFamily: cmsData.appearance.fontFamily,
      '--primary-color': cmsData.appearance.primaryColor,
      '--secondary-color': cmsData.appearance.secondaryColor,
    } as React.CSSProperties}>
      <h1 
        onClick={resetFilters}
        className="text-3xl font-bold mb-2 cursor-pointer transition-colors duration-200 hover:opacity-80"
        style={{ color: 'var(--primary-color)' }}
      >
        {cmsData.pageTitle}
      </h1>
      <p className="mb-6 text-gray-600">{cmsData.pageDescription}</p>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 lg:w-1/4 space-y-2 md:sticky md:top-4 md:h-[calc(100vh-6rem)] md:overflow-y-auto px-1">
          {cmsData.filterCategories.map((category, index) => (
            <React.Fragment key={category.name}>
              <FilterCategory title={category.name} values={category.values} />
              {index < cmsData.filterCategories.length - 1 && <Separator className="my-2" />}
            </React.Fragment>
          ))}
        </div>

        <Separator orientation="vertical" className="hidden md:block" />

        <div className="md:w-2/3 lg:w-3/4 md:h-[calc(100vh-6rem)] md:overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredBooks.map((book) => (
              <div key={book.id} className="relative group overflow-hidden rounded-lg">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-auto transition-all duration-300 ease-in-out group-hover:scale-105"
                />
                <div 
                  className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-95 transition-all duration-300 ease-in-out bg-gradient-to-t from-indigo-600/90 via-purple-500/50 to-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(to top, rgba(255, 223, 220, 0.95), rgba(202, 227, 255, 0.5) 50%, transparent)'
                  }}
                >
                  <h3 className="text-black text-sm font-semibold truncate drop-shadow-sm">{book.title}</h3>
                  <p className="text-black/90 text-xs truncate drop-shadow-sm">{book.author}</p>
                  <p className="text-black/90 text-xs capitalize truncate drop-shadow-sm">{book.genre}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}