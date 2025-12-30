/**
 * Common Component Library - Barrel Exports
 * Feature: 008-common-components
 * 
 * Centralized exports for all common UI components.
 * Import components using: import { Button, Text, Card } from '@/components/common'
 */

// Typography
export { Text } from './Text/Text';
export type { TextProps, TextVariant, TextColor, FontWeight, PolymorphicTextProps } from './Text/Text.types';

// Buttons
export { Button } from './Button/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button/Button.types';

export { IconButton } from './IconButton/IconButton';
export type { IconButtonProps } from './IconButton/IconButton.types';

// Layout
export { Card } from './Card/Card';
export type { CardProps, CardElevation, CardPadding } from './Card/Card.types';

export { LoadingSpinner } from './LoadingSpinner/LoadingSpinner';
export type { LoadingSpinnerProps, SpinnerSize } from './LoadingSpinner/LoadingSpinner.types';

export { PageLoading } from './PageLoading/PageLoading';
export type { PageLoadingProps } from './PageLoading/PageLoading.types';

// Form Inputs
export { Input } from './Input/Input';
export type { InputProps, InputType, InputValidationState, InputSize, BaseInputProps } from './Input/Input.types';

export { Select } from './Select/Select';
export type { SelectProps, SelectOption } from './Select/Select.types';

// Feedback
export { Alert } from './Alert/Alert';
export type { AlertProps, AlertSeverity } from './Alert/Alert.types';

export { Badge } from './Badge/Badge';
export type { BadgeProps, BadgeVariant, BadgeSize } from './Badge/Badge.types';

export { EmptyState } from './EmptyState/EmptyState';
export type { EmptyStateProps } from './EmptyState/EmptyState.types';

// Navigation
export { Link } from './Link/Link';
export type { LinkProps, LinkVariant } from './Link/Link.types';

export { TabNavigation } from './TabNavigation/TabNavigation';
export type { TabNavigationProps, Tab } from './TabNavigation/TabNavigation.types';

export { PageHeader } from './PageHeader/PageHeader';
export type { PageHeaderProps } from './PageHeader/PageHeader.types';

// Quantity Controls
export { default as QuantityControls } from './QuantityControls';
export type { QuantityControlsProps } from './QuantityControls';
