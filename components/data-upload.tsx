'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Upload, FileUp } from 'lucide-react'
import { useState } from 'react'

interface DataUploadProps {
  onClose: () => void
}

export function DataUpload({ onClose }: DataUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) setFile(droppedFile)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) setFile(selectedFile)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Upload Attendance Data</CardTitle>
              <CardDescription>Import CSV or Excel file</CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragging 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
          >
            <FileUp className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground mb-1">Drop your file here</p>
            <p className="text-xs text-muted-foreground mb-3">or</p>
            <input 
              type="file" 
              onChange={handleFileSelect}
              accept=".csv,.xlsx,.xls"
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input">
              <Button asChild variant="outline" size="sm">
                <span>Browse Files</span>
              </Button>
            </label>
          </div>

          {file && (
            <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
              <p className="text-sm font-medium text-foreground flex items-center gap-2">
                <Upload className="w-4 h-4 text-accent" />
                {file.name}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1"
              disabled={!file}
            >
              Upload & Analyze
            </Button>
          </div>

          <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-border">
            <p className="font-medium">File format requirements:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Required columns: Date, Student ID, Present (Yes/No)</li>
              <li>Supported formats: CSV, XLSX</li>
              <li>Max file size: 10 MB</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
