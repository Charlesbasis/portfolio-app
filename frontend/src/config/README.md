# User Type Configuration

This directory contains configuration files for user types.

## Files

- `skillCategories.ts` - Skill definitions organized by category
- `userTypeBuilder.ts` - Transforms API data to frontend format
- `index.ts` - Fallback configurations (use only as last resort)

## Usage

Always use the `useUserTypeConfig` hook:

\`\`\`typescript
import { useUserTypeConfig } from '@/src/hooks/useUserTypeConfig';

const { userTypes, currentConfig } = useUserTypeConfig('student');
\`\`\`

## Adding New User Types

Add to database, no code changes needed!

\`\`\`bash
php artisan db:seed --class=UserTypeSeeder
\`\`\`