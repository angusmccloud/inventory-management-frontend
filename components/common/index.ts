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

export { default as MultiSelect } from './MultiSelect';

export { default as Autocomplete } from './Autocomplete/Autocomplete';
export type { AutocompleteProps, AutocompleteOption } from './Autocomplete/Autocomplete.types';

export { Radio } from './Radio/Radio';
export type { RadioProps, RadioOption } from './Radio/Radio.types';

export { Checkbox } from './Checkbox/Checkbox';
export type { CheckboxProps } from './Checkbox/Checkbox.types';

export { ToggleButton } from './ToggleButton/ToggleButton';
export type { ToggleButtonProps, ToggleButtonVariant, ToggleButtonSize } from './ToggleButton/ToggleButton.types';

// Feedback
export { Alert } from './Alert/Alert';
export type { AlertProps, AlertSeverity } from './Alert/Alert.types';

export { Badge } from './Badge/Badge';
export type { BadgeProps, BadgeVariant, BadgeSize } from './Badge/Badge.types';

export { EmptyState } from './EmptyState/EmptyState';
export type { EmptyStateProps } from './EmptyState/EmptyState.types';

export { default as Modal } from './Modal/Modal';
export type { ModalProps, ModalSize } from './Modal/Modal.types';

// Navigation
export { Link } from './Link/Link';
export type { LinkProps, LinkVariant } from './Link/Link.types';

export { TabNavigation } from './TabNavigation/TabNavigation';
export type { TabNavigationProps, Tab } from './TabNavigation/TabNavigation.types';

export { PageHeader } from './PageHeader/PageHeader';
export type { PageHeaderProps } from './PageHeader/PageHeader.types';

export { PageContainer } from './PageContainer/PageContainer';
export type { PageContainerProps } from './PageContainer/PageContainer';

// Quantity Controls
export { default as QuantityControls } from './QuantityControls';
export type { QuantityControlsProps } from './QuantityControls';
