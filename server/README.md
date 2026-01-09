# Server Directory

This directory contains all backend logic for the application, organized into a clean, maintainable structure.

## Structure

```
server/
├── actions/          # Next Safe Actions (for client/server components)
├── services/         # Business logic layer
├── schemas/          # Zod validation schemas
├── lib/              # Reusable utilities
├── types/            # TypeScript type definitions
└── config/           # Configuration files
```

## Architecture

### Services (`server/services/`)
Services contain business logic and interact with the database. They are reusable across different parts of the application.

**Example:**
- `student.service.ts` - Student-related business logic
- `company.service.ts` - Company-related business logic
- `verification.service.ts` - Email verification logic
- `password-reset.service.ts` - Password reset logic

### Actions (`server/actions/`)
Next Safe Actions provide type-safe server actions that can be called from React components. They use the services and schemas.

**Note:** These are primarily for use in React Server/Client Components. API routes call services directly.

### Schemas (`server/schemas/`)
Zod schemas for validation. All user input is validated using these schemas.

### Lib (`server/lib/`)
Reusable utility functions:
- `password.ts` - Password hashing and verification
- `email.ts` - Email sending utilities
- `crypto.ts` - Cryptographic utilities

## Usage

### In API Routes
```typescript
import { StudentService } from "@/server/services/student.service";
import { createStudentSchema } from "@/server/schemas/student.schema";

// Validate input
const validatedData = createStudentSchema.parse(body);

// Call service
const result = await StudentService.createStudent(validatedData);
```

### In React Components (Server Actions)
```typescript
"use client";

import { createStudentAction } from "@/server/actions/student.actions";
import { useAction } from "next-safe-action/hooks";

const { execute, result } = useAction(createStudentAction);

// Use execute() to call the action
```

## Best Practices

1. **Always validate input** using Zod schemas
2. **Use services** for business logic, not API routes
3. **Keep services pure** - they should only contain business logic
4. **Use types** from `server/types/` for shared type definitions
5. **Handle errors properly** - catch and return appropriate HTTP status codes
