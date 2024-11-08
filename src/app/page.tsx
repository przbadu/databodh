'use client'

import { useState, useCallback, useEffect } from 'react'
import { Upload, Search, SlidersHorizontal, AlertCircle } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function Component() {
  const [data, setData] = useState<any[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [visibleColumns, setVisibleColumns] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isJsonData, setIsJsonData] = useState(false)
  const [flattenJson, setFlattenJson] = useState(false)

  const flattenObject = (obj: Record<string, unknown>, parentKey = '', result: Record<string, unknown> = {}): Record<string, unknown> => {
    for (const key in obj) {
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        // Recursively flatten nested objects
        flattenObject(obj[key] as Record<string, unknown>, newKey, result);
      } else {
        // Assign top-level or flattened key-value pairs
        result[newKey] = obj[key];
      }
    }
    return result;
  };

  const handleFileUpload = useCallback(async (file: File) => {
    setError(null)
    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        let parsedData: any[] = []

        if (file.name.endsWith('.csv')) {
          const text = e.target?.result as string
          parsedData = text.split('\n').map(row => {
            const values = row.split(',')
            return columns.reduce((obj, col, index) => {
              obj[col] = values[index]
              return obj
            }, {} as Record<string, string>)
          })
          setIsJsonData(false)
        } else if (file.name.endsWith('.json') || file.name.endsWith('.ndjson')) {
          const text = e.target?.result as string
          const lines = file.name.endsWith('.json') ? [text] : text.split('\n').filter(line => line.trim())
          parsedData = lines.map((line) => {
            const jsonObject = JSON.parse(line);
            return flattenJson ? flattenObject(jsonObject) : jsonObject;
          })
          setIsJsonData(true)
        }

        if (parsedData.length === 0) {
          throw new Error('The file is empty or contains no valid data.')
        }

        // Extract columns from the first row/object
        const cols = parsedData.length > 0 ? Object.keys(parsedData[0]) : []
        setColumns(cols)
        setVisibleColumns(cols)
        setData(parsedData)
      }

      reader.onerror = () => {
        throw new Error('Error reading file.')
      }

      if (file.name.endsWith('.json') || file.name.endsWith('.ndjson') || file.name.endsWith('.csv')) {
        reader.readAsText(file)
      } else {
        throw new Error('Unsupported file format. Please upload a CSV, JSON, or NDJSON file.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.')
    }
  }, [columns, flattenJson])

  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }, [handleFileUpload])

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const pastedText = e.clipboardData?.getData('text')
      if (pastedText) {
        try {
          const parsedData = JSON.parse(pastedText)
          if (Array.isArray(parsedData)) {
            setData(parsedData.map(item => flattenJson ? flattenObject(item) : item))
            const cols = parsedData.length > 0 ? Object.keys(flattenJson ? flattenObject(parsedData[0]) : parsedData[0]) : []
            setColumns(cols)
            setVisibleColumns(cols)
            setIsJsonData(true)
          } else {
            throw new Error('Pasted data is not a valid JSON array.')
          }
        } catch (err) {
          setError('Failed to parse pasted data. Please ensure it\'s a valid JSON array.')
        }
      }
    }

    document.addEventListener('paste', handlePaste)
    return () => {
      document.removeEventListener('paste', handlePaste)
    }
  }, [flattenJson])

  useEffect(() => {
    if (isJsonData && data.length > 0) {
      const newData = data.map(item => flattenJson ? flattenObject(item) : item)
      setData(newData)
      const newColumns = Object.keys(newData[0])
      setColumns(newColumns)
      setVisibleColumns(newColumns)
    }
  }, [flattenJson, isJsonData])

  return (
    <div className="max-w-max mx-auto p-2 sm:p-4 md:p-6 min-h-screen flex items-center justify-center">
      <Card className={`backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 shadow-xl w-full ${data.length > 0 ? 'h-[calc(100vh-2rem)]' : ''}`}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Data Viewer</CardTitle>
          <CardDescription>
            View your data files, big or small, in an easy to use table.
          </CardDescription>
        </CardHeader>
        <CardContent className={`${data.length > 0 ? 'h-[calc(100%-6rem)] flex flex-col p-4 pb-4' : 'space-y-4'}`}>
          {data.length === 0 ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                isDragging ? 'border-primary bg-primary/10' : 'border-muted hover:bg-muted/50'
              }`}
            >
              <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    CSV, JSON, NDJSON supported
                  </p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".csv,.json,.ndjson"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(file)
                  }}
                />
              </label>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-4">
                <div className="flex-1 w-full sm:w-auto">
                  <Input
                    placeholder="Search in all columns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-4">
                  {isJsonData && !flattenJson && (
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="flatten-json"
                        checked={flattenJson}
                        onCheckedChange={setFlattenJson}
                      />
                      <Label htmlFor="flatten-json">Flatten JSON</Label>
                    </div>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <SlidersHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {columns.map((column) => (
                        <DropdownMenuCheckboxItem
                          key={column}
                          checked={visibleColumns.includes(column)}
                          onCheckedChange={(checked) => {
                            setVisibleColumns(
                              checked
                                ? [...visibleColumns, column]
                                : visibleColumns.filter((col) => col !== column)
                            )
                          }}
                        >
                          {column}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="flex-1 overflow-auto border rounded-lg" style={{ maxHeight: 'calc(100% - 120px)' }}>
                <div className="min-w-max">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {visibleColumns.map((column) => (
                        <TableHead key={column}>{column}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {visibleColumns.map((column) => (
                          <TableCell key={column}>
                            {isJsonData && !flattenJson && typeof row[column] === 'object'
                              ? JSON.stringify(row[column], null, 2)
                              : String(row[column])}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2">
                <Select
                  value={String(itemsPerPage)}
                  onValueChange={(value) => setItemsPerPage(Number(value))}
                >
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Rows per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="25">25 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                    <SelectItem value="100">100 per page</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}