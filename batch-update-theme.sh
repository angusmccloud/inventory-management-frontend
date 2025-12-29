#!/bin/bash
# Theme Color Batch Update Script
# Updates remaining feature components with theme colors

set -e

FE_DIR="/Users/connortyrrell/Repos/inventory-management/inventory-management-frontend"
cd "$FE_DIR"

echo "🎨 Batch updating feature components with theme colors..."

# Function to update a file with multiple sed replacements
update_file() {
  local file=$1
  echo "  📝 Updating $file"
  
  # Text colors
  sed -i '' 's/text-gray-700 dark:text-gray-300/text-text-default/g' "$file"
  sed -i '' 's/text-gray-600 dark:text-gray-400/text-text-secondary/g' "$file"
  sed -i '' 's/text-gray-500 dark:text-gray-400/text-text-secondary/g' "$file"
  sed -i '' 's/text-gray-900 dark:text-gray-100/text-text-default/g' "$file"
  sed -i '' 's/text-gray-800 dark:text-gray-200/text-text-default/g' "$file"
  
  # Background colors
  sed -i '' 's/bg-white dark:bg-gray-800/bg-surface/g' "$file"
  sed -i '' 's/bg-gray-50 dark:bg-gray-700/bg-surface-elevated/g' "$file"
  sed -i '' 's/bg-red-50 dark:bg-red-900\/20/bg-error\/10/g' "$file"
  
  # Error colors
  sed -i '' 's/text-red-800 dark:text-red-200/text-error/g' "$file"
  sed -i '' 's/text-red-600 dark:text-red-400/text-error/g' "$file"
  sed -i '' 's/border-red-200 dark:border-red-800/border-error\/30/g' "$file"
  
  # Ring/border colors
  sed -i '' 's/ring-gray-300 dark:ring-gray-600/ring-border/g' "$file"
  sed -i '' 's/border-gray-200 dark:border-gray-700/border-border/g' "$file"
  sed -i '' 's/border-gray-300 dark:border-gray-600/border-border/g' "$file"
  
  # Focus states
  sed -i '' 's/focus:ring-blue-600 dark:focus:ring-blue-500/focus:ring-primary/g' "$file"
  sed -i '' 's/focus:ring-blue-600/focus:ring-primary/g' "$file"
  sed -i '' 's/focus:ring-blue-500/focus:ring-primary/g' "$file"
  
  # Placeholder colors
  sed -i '' 's/placeholder:text-gray-400 dark:placeholder:text-gray-500/placeholder:text-text-disabled/g' "$file"
  
  # Button colors
  sed -i '' 's/bg-blue-600 hover:bg-blue-700/bg-primary hover:bg-primary-hover/g' "$file"
  sed -i '' 's/text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300/text-primary hover:text-primary-hover/g' "$file"
  sed -i '' 's/bg-gray-100 hover:bg-gray-200/bg-surface-elevated hover:bg-surface/g' "$file"
  
  # Background surface colors
  sed -i '' 's/dark:bg-gray-800/bg-surface/g' "$file"
}

# Shopping list components
echo "📦 Updating shopping list components..."
update_file "components/shopping-list/AddItemForm.tsx"
update_file "components/shopping-list/EditShoppingListItemForm.tsx"
update_file "components/shopping-list/ShoppingListItem.tsx"

# Member components  
echo "👥 Updating member components..."
update_file "components/members/RemoveMemberDialog.tsx"
update_file "components/members/InvitationList.tsx"
update_file "components/members/MemberCard.tsx"

# Inventory list
echo "📋 Updating inventory list..."
update_file "components/inventory/InventoryList.tsx"

# Dashboard components
echo "📊 Updating dashboard components..."
update_file "components/dashboard/NFCStatsWidget.tsx"

echo "✅ Batch update complete!"
echo ""
echo "Files updated:"
echo "  - 3 shopping list components"
echo "  - 3 member components"
echo "  - 1 inventory list"
echo "  - 1 dashboard widget"
echo ""
echo "Next: Manually review NFCUrlManager.tsx (complex component)"
