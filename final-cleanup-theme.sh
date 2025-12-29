#!/bin/bash
# Final cleanup - Update all remaining pages and components

set -e

FE_DIR="/Users/connortyrrell/Repos/inventory-management/inventory-management-frontend"
cd "$FE_DIR"

echo "🧹 Final cleanup of remaining hardcoded colors..."

# Function to update a file
update_file() {
  local file=$1
  echo "  📝 $file"
  
  # Text colors
  sed -i '' -E 's/text-gray-([0-9]+) dark:text-gray-([0-9]+)/text-text-default/g' "$file"
  sed -i '' -E 's/text-gray-([0-9]+)/text-text-secondary/g' "$file"
  sed -i '' -E 's/text-blue-([0-9]+) dark:text-blue-([0-9]+)/text-primary/g' "$file"
  sed -i '' -E 's/text-blue-([0-9]+)/text-primary/g' "$file"
  sed -i '' -E 's/text-red-([0-9]+) dark:text-red-([0-9]+)/text-error/g' "$file"
  sed -i '' -E 's/text-red-([0-9]+)/text-error/g' "$file"
  sed -i '' -E 's/text-green-([0-9]+) dark:text-green-([0-9]+)/text-secondary-contrast/g' "$file"
  sed -i '' -E 's/text-green-([0-9]+)/text-secondary-contrast/g' "$file"
  sed -i '' -E 's/text-yellow-([0-9]+) dark:text-yellow-([0-9]+)/text-tertiary-contrast/g' "$file"
  sed -i '' -E 's/text-yellow-([0-9]+)/text-tertiary-contrast/g' "$file"
  
  # Background colors
  sed -i '' -E 's/bg-white dark:bg-gray-([0-9]+)/bg-surface/g' "$file"
  sed -i '' -E 's/bg-gray-50 dark:bg-gray-([0-9]+)/bg-surface-elevated/g' "$file"
  sed -i '' -E 's/bg-gray-([0-9]+) dark:bg-gray-([0-9]+)/bg-surface-elevated/g' "$file"
  sed -i '' -E 's/bg-gray-([0-9]+)/bg-surface-elevated/g' "$file"
  sed -i '' -E 's/bg-blue-([0-9]+) hover:bg-blue-([0-9]+)/bg-primary hover:bg-primary-hover/g' "$file"
  sed -i '' -E 's/bg-blue-([0-9]+)/bg-primary/g' "$file"
  sed -i '' -E 's/bg-red-([0-9]+) dark:bg-red-([0-9]+)/bg-error\/10/g' "$file"
  sed -i '' -E 's/bg-red-([0-9]+)/bg-error\/10/g' "$file"
  sed -i '' -E 's/bg-green-([0-9]+) dark:bg-green-([0-9]+)/bg-secondary\/10/g' "$file"
  sed -i '' -E 's/bg-green-([0-9]+)/bg-secondary\/10/g' "$file"
  sed -i '' -E 's/bg-yellow-([0-9]+) dark:bg-yellow-([0-9]+)/bg-tertiary\/10/g' "$file"
  sed -i '' -E 's/bg-yellow-([0-9]+)/bg-tertiary\/10/g' "$file"
  
  # Border colors
  sed -i '' -E 's/border-gray-([0-9]+) dark:border-gray-([0-9]+)/border-border/g' "$file"
  sed -i '' -E 's/border-gray-([0-9]+)/border-border/g' "$file"
  sed -i '' -E 's/border-blue-([0-9]+) dark:border-blue-([0-9]+)/border-primary/g' "$file"
  sed -i '' -E 's/border-blue-([0-9]+)/border-primary/g' "$file"
  sed -i '' -E 's/border-red-([0-9]+) dark:border-red-([0-9]+)/border-error/g' "$file"
  sed -i '' -E 's/border-red-([0-9]+)/border-error/g' "$file"
  sed -i '' -E 's/border-green-([0-9]+) dark:border-green-([0-9]+)/border-secondary/g' "$file"
  sed -i '' -E 's/border-green-([0-9]+)/border-secondary/g' "$file"
  sed -i '' -E 's/border-yellow-([0-9]+) dark:border-yellow-([0-9]+)/border-tertiary/g' "$file"
  sed -i '' -E 's/border-yellow-([0-9]+)/border-tertiary/g' "$file"
  
  # Ring colors (focus states)
  sed -i '' -E 's/ring-gray-([0-9]+) dark:ring-gray-([0-9]+)/ring-border/g' "$file"
  sed -i '' -E 's/ring-gray-([0-9]+)/ring-border/g' "$file"
  sed -i '' -E 's/ring-blue-([0-9]+) dark:ring-blue-([0-9]+)/ring-primary/g' "$file"
  sed -i '' -E 's/ring-blue-([0-9]+)/ring-primary/g' "$file"
  sed -i '' -E 's/focus:ring-blue-([0-9]+)/focus:ring-primary/g' "$file"
  sed -i '' -E 's/focus:border-blue-([0-9]+)/focus:border-primary/g' "$file"
}

# Get all files with hardcoded colors (excluding theme-test which is intentional)
FILES=$(grep -rl "bg-\(red\|blue\|gray\|green\|yellow\)-[0-9]" app/ components/ --include="*.tsx" --include="*.jsx" | grep -v "theme-test" | grep -v "node_modules" | sort -u)

for file in $FILES; do
  update_file "$file"
done

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "Checking remaining instances (excluding theme-test)..."
REMAINING=$(grep -r "bg-\(red\|blue\|gray\|green\|yellow\)-[0-9]" app/ components/ --include="*.tsx" --include="*.jsx" | grep -v "theme-test" | grep -v "node_modules" | wc -l | tr -d ' ')
echo "Remaining hardcoded colors: $REMAINING"

if [ "$REMAINING" -eq "0" ]; then
  echo "🎉 All hardcoded colors replaced with theme tokens!"
else
  echo "⚠️  Some instances remain - review manually"
  grep -r "bg-\(red\|blue\|gray\|green\|yellow\)-[0-9]" app/ components/ --include="*.tsx" --include="*.jsx" | grep -v "theme-test" | grep -v "node_modules" | cut -d: -f1 | sort -u
fi
