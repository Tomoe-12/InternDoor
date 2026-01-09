// "use client";

// import { cn } from "@/lib/utils";
// import { useId } from "react";

// interface FileUploadProps {
//   children: React.ReactNode;
//   className?: string;
//   allowedTypes?: string[];
//   maxSize?: number;
//   dimensions?: string;
//   onFileSelect: (file: File) => void;
//   onValidationError?: (error: string) => void;
//   disabled?: boolean;
// }
// export default function FileUpload({
//   children,
//   className,
//   maxSize,
//   allowedTypes,
//   dimensions,
//   disabled,
//   onValidationError,
//   onFileSelect,
// }: FileUploadProps) {
//   const id = useId();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (maxSize) {
//       if (file.size > maxSize) {
//         if (onValidationError) onValidationError("File is too large");
//         return;
//       }
//     }

//     if (allowedTypes && allowedTypes.length > 0) {
//       if (!allowedTypes.includes(file.type)) {
//         if (onValidationError)
//           onValidationError(
//             "Invalid file type, allowed types are: " +
//               allowedTypes.join(", ") +
//               ". Got: " +
//               file.type
//           );
//         return;
//       }
//     }

//     if (dimensions) {
//       const [widthStr, heightStr] = dimensions.split("x");
//       const width = parseInt(widthStr || "0");
//       const height = parseInt(heightStr || "0");

//       const img = new Image();
//       img.src = URL.createObjectURL(file);
//       img.onload = () => {
//         if (img.width !== width || img.height !== height) {
//           if (onValidationError)
//             onValidationError(
//               "Invalid image dimensions, expected: " +
//                 width +
//                 "x" +
//                 height +
//                 ". Got: " +
//                 img.width +
//                 "x" +
//                 img.height
//             );
//           return;
//         }
//       };
//     }

//     onFileSelect(file);
//   };

//   return (
//     <div>
//       <label htmlFor={id} className={cn("cursor-pointer ", className)}>
//         {children}
//       </label>
//       <input
//         type="file"
//         id={id}
//         className="hidden"
//         disabled={disabled}
//         onChange={handleChange}
//         multiple={false}
//       />
//     </div>
//   );
// }

//  this is for the landing page 


"use client"

import * as React from "react"
import { Upload, X, FileIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface FileUploadProps {
  value?: File | null
  onChange?: (file: File | null) => void
  accept?: string
  maxSize?: number
  disabled?: boolean
  className?: string
}

export function FileUpload({
  value,
  onChange,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB default
  disabled = false,
  className,
}: FileUploadProps) {
  const [preview, setPreview] = React.useState<string | null>(null)
  const [dragActive, setDragActive] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (value && value.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(value)
    } else {
      setPreview(null)
    }
  }, [value])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (disabled) return

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (disabled) return

    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFile = (file: File) => {
    if (maxSize && file.size > maxSize) {
      alert(`File size must be less than ${maxSize / 1024 / 1024}MB`)
      return
    }

    onChange?.(file)
  }

  const handleRemove = () => {
    onChange?.(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className={cn("w-full", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={disabled}
        className="hidden"
        aria-label="File upload"
      />

      {value ? (
        <div className="relative flex items-center gap-4 rounded-lg border border-input bg-background p-4">
          {preview ? (
            <img src={preview || "/placeholder.svg"} alt="Preview" className="size-20 rounded-md object-cover" />
          ) : (
            <div className="flex size-20 items-center justify-center rounded-md bg-muted">
              <FileIcon className="size-8 text-muted-foreground" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium">{value.name}</p>
            <p className="text-xs text-muted-foreground">{(value.size / 1024).toFixed(2)} KB</p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleRemove}
            disabled={disabled}
            className="shrink-0"
          >
            <X className="size-4" />
            <span className="sr-only">Remove file</span>
          </Button>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input bg-background p-8 text-center transition-colors cursor-pointer hover:border-primary hover:bg-accent",
            dragActive && "border-primary bg-accent",
            disabled && "cursor-not-allowed opacity-50",
          )}
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <Upload className="size-6 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground">
              {accept === "image/*" ? "PNG, JPG, GIF up to" : "Files up to"} {maxSize / 1024 / 1024}MB
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
